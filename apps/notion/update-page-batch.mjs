import { Client } from "@notionhq/client"
export default defineComponent({
    name: 'Batch Update Pages',
    version: '0.0.1',
    key: 'update-page-batch',
    description: "Batch Update Pages",
    type: 'action',
    props: {
        notion: {
            type: "app",
            app: "notion",
        },
        page_id_list: {
            type: 'string[]',
            label: 'Page ID List',
            description: 'Page ID List',
        },
        properties: {
          type: 'string',
          label: 'Properties',
          description: 'Properties need to be updated',
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
      async updatePage(pageId) {
        const properties = JSON.parse(this.properties);
        return await this.notion_client().pages.update({
          page_id: pageId,
          properties,
        });
      },
    },
    async run({ steps, $ }) {
        let newPages = [];
        const pageIdList = this.page_id_list || [];
        await Promise.all(pageIdList.map(async (e) => {
          const newPage = await this.updatePage(e);
          newPages.push(newPage);
        }))
        return newPages;
    },
})
