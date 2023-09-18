import { Client } from "@notionhq/client"
export default defineComponent({
  name: 'Query Pages From Database',
  version: '0.0.1',
  key: 'query-database',
  description: "Query Pages From Database",
  type: 'action',
  props: {
    notion: {
      type: "app",
      app: "notion",
    },
    databaseId: {
      type: 'string',
      label: 'DatabaseId',
      description: 'Database ID',
    },
    requestData: {
      type: 'string',
      label: 'RequestData',
      description: 'RequestParam, see the [doc](https://developers.notion.com/reference/post-database-query)',
    }
  },

  methods: {
    /**
     * 获取 notion client
     * @returns notion client
     */
    notionClient() {
      return new Client({ auth: `${this.notion.$auth.oauth_access_token}` });
    },
  },
  async run({ steps, $ }) {
    const data = JSON.parse(this.requestData) || {};
    const databaseId = this.databaseId;
    return await this.notionClient().databases.query({
      database_id: databaseId,
      ...data,
    })
  },
})
