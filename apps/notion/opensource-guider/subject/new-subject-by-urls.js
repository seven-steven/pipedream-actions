import { Client } from "@notionhq/client"
import moment from 'moment-timezone'

export default defineComponent({
  name: 'New Subject By URLs',
  version: '0.0.3',
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
    validUrl(urlList) {
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
     * 根据 url 查询已存在的记录
     * @param {string} validUrlList 待新增的合法的 url 列表
     */
    async duplicateRecordList(validUrlList) {
      const filter_urls = validUrlList.map(url => {
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

      const duplicateRecordResult = await this.notion_client().databases.query({
        database_id: this.database_id,
        filter,
      });
      console.log('duplicateRecordResult', duplicateRecordResult);
      return duplicateRecordResult?.results || [];
    },
    /**
     * 过滤不合法和已存在的 URL
     * @param {string} validUrlList 待新增的合法的 url 列表
     * @param {notionPage} duplicateRecordList 重复的 notion 记录列表
     * @returns 合法且不重复的 url 列表
     */
    notExistUrlList(validUrlList, duplicateRecordList) {
      const dump_urls = duplicateRecordList?.map(subject => subject?.properties?.URL?.url) || [];
      return validUrlList.filter(url => !dump_urls.includes(url)) || [];
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
          LatestTrendingDate: {
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
    async updatePage(pageId) {
      const today = this.today();

      const properties = {
        LatestTrendingDate: {
          date: {
            start: today,
          }
        },
      };
      return await this.notion_client().pages.update({
        page_id: pageId,
        properties,
      });
    },
    async updatePageList(pageList) {
      let updatedPageList = [];
      const pageIdList = pageList?.map(subject => subject?.id) || [];
      await Promise.all(pageIdList.map(async (e) => {
        const newPage = await this.updatePage(e);
        updatedPageList.push(newPage);
      }))
      return updatedPageList;
    }
  },
  async run({ steps, $ }) {
    const validUrlList = this.validUrl(this.subject_url_list) || [];
    const duplicateRecordList = await this.duplicateRecordList(validUrlList);
    console.log('duplicateRecordList', duplicateRecordList);
    const notExistUrlList = this.notExistUrlList(validUrlList, duplicateRecordList);

    let newPageList = [];
    console.log(notExistUrlList);
    await Promise.all(notExistUrlList.map(async (e) => {
      const newPage = await this.newSubject(this.database_id, e);
      newPageList.push(newPage);
    }));
    // 更新已经存在的记录
    let updatePageList = await this.updatePageList(duplicateRecordList);

    return {
      newPageList,
      updatePageList,
    };
  },
})
