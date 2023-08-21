import { Client } from "@notionhq/client"
import { moment } from "moment-timezone"

export default defineComponent({
  name: 'New Subject By URLs',
  version: '0.0.1',
  key: 'new-subject-by-urls',
  description: "New Subject By URLs",
  type: 'action',
  props: {
    notion: {
      type: "app",
      app: "notion",
    },
    database_id: {
      type: 'string',
      label: 'DatabaseID',
      description: 'ID of the Database',
    },
    subject_url_list: {
      type: 'string[]',
      label: 'Subject URL List',
      description: 'Subject URL List',
    }
  },

  methods: {
    /**
     * 获取 notion client
     * @returns notion client
     */
    notion_client() {
      return new Client({ auth: `${this.notion.$auth.oauth_access_token}` });
    },
    /**
     * 过滤非法 url, 规整合法 url
     * @param {string} urlList 待新增 url 列表
     * @returns
     */
    valid_url(urlList) {
      return urlList.filter(url => url.includes('github.com'))
        .map(url => {
          const [, owner, repo] = url.match(/github\.com\/(.+)\/(.+)/);
          return `https://github.com/${owner}/${repo}`;
        });
    },
    today() {
      return moment().tz('Asia/Shanghai').format();
    },
    /**
     * 过滤不合法和已存在的 URL
     * @param {string} urlList 待新增 url 列表
     * @returns 合法且不重复的 url 列表
     */
    async not_exist_url(urlList) {
      urlList = this.valid_url(urlList);
      const filter_urls = urlList.map(url => {
        return {
          "property": "URL",
          "url": {
            "equals": url
          }
        }
      });

      const filter = {
        or: filter_urls,
      }

      const dump_records = await this.notion_client().databases.query({
        database_id: this.database_id,
        filter,
      });
      const dump_urls = dump_records?.results?.map(subject => subject.properties.URL.url) || [];
      return urlList.filter(url => !dump_urls.includes(url));
    },
    async newSubject(parentId, url) {
      const [, owner, repo] = url.match(/https?:\/\/github\.com\/(.+)\/(.+)/);
      let name = owner + '/' + repo;
      const today = this.today();

      return await this.notion_client().pages.create({
        parent: {
          database_id: parentId,
        },
        properties: {
          URL: {
            url: url,
          },
          Source: {
            select: {
              name: 'Trending',
            }
          },
          LastTrendingDate: {
            date: {
              start: today,
            }
          },
          Name: {
            title: [
              {
                text: {
                  content: name,
                }
              },
            ],
          },
        },
      });
    },
  },
  async run({ steps, $ }) {
    let newPages = [];
    const valid_url_list = await this.not_exist_url(this.subject_url_list) || [];
    console.log(valid_url_list);
    await Promise.all(valid_url_list.map(async (e) => {
      let newPage = await this.newSubject(this.database_id, e);
      newPages.push(newPage);
    }));
    return newPages;
  },
})
