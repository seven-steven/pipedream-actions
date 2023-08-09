import { Client } from "@notionhq/client"
export default defineComponent({
  name: 'Create OSG Post',
  version: '0.0.1',
  key: 'osg-post-create',
  description: "Create OSG Post",
  type: 'action',
  props: {
    notion: {
      type: "app",
      app: "notion",
    },
    parent_database_id: {
      type: 'string',
      label: 'ParentDatabaseId',
      description: 'ParentDatabaseId',
    },
    cover: {
      type: 'string',
      label: 'Cover URL',
      description: 'Cover external URL',
      optional: true,
    },
    title: {
      type: 'string',
      label: 'Title',
      description: 'Title',
    },
    content: {
      type: 'string',
      label: 'Page Content',
      description: 'Page Content',
      optional: true,
    },
    topic: {
      type: 'string[]',
      label: 'Topic',
      description: 'Topic',
      optional: true,
    },
    subjects: {
      type: 'string[]',
      label: 'Subjects',
      description: 'Subjects',
      optional: true,
    },
    summary: {
      type: 'string',
      label: 'Summary',
      description: 'Summary',
      optional: true,
    }
  },
  methods: {
  },
  async run({ steps, $ }) {
    let properties = {};
    // 设置文章标题
    if (Boolean(this.title)) {
      properties['Title'] = {
        title: [
          {
            text: {
              content: this.title,
            }
          }
        ]
      }
    };
    // 设置文章关联专题
    const topic = this.topic || [];
    if (Boolean(topic)) {
      properties['Topic'] = {
        relation: topic.filter(e => Boolean(e)).map(e => { return { id: e } }),
      }
    }
    // 设置文章关联开源项目
    const subjects = this.subjects || [];
    if (Boolean(subjects)) {
      properties['Subjects'] = {
        relation: subjects.filter(e => Boolean(e)).map(e => { return { id: e } }),
      }
    }
    // 设置文章内容

    // 设置页面信息
    let page = {
      parent: {
        type: 'database_id',
        database_id: this.parent_database_id,
      }
    };
    // 设置封面图
    if (Boolean(this.cover)) {
      page.cover = {
        type: 'external',
        external: {
          url: this.cover,
        }
      }
    };
    if (Boolean(properties)) {
      page.properties = properties;
    }

    console.log(JSON.stringify(page));
    const notion = new Client({ auth: `${this.notion.$auth.oauth_access_token}` });
    console.log(this.notion.$auth.oauth_access_token);
    return await notion.pages.create(page);
  },
})
