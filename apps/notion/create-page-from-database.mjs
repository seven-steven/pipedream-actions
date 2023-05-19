import { Client } from "@notionhq/client"
export default defineComponent({
    name: 'Create Page From Database',
    version: '0.0.3',
    key: 'create-page-from-database',
    description: "Create Page From Database. [See the docs](https://developers.notion.com/reference/post-page)",
    type: 'action',
    props: {
        notion: {
            type: "app",
            app: "notion",
        },
        parent_database_id: {
            type: 'string',
            label: 'Parent Database ID',
            description: 'Parent Database ID',
        },
        properties: {
            type: 'string',
            label: 'Properties',
            description: 'Properties of the page. Should be a JSON string. [See the docs](https://developers.notion.com/reference/page-property-values)',
        },
        meta_data: {
            type: 'string',
            label: 'MetaData',
            description: 'Meta Data',
            optional: true,
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

        async newPage() {
            const properties = JSON.parse(this.properties);
            let page_data = {
                parent: {
                    database_id: this.parent_database_id,
                },
                properties: {
                    ...properties,
                },
            };

            if (Boolean(this.meta_data)) {
                page_data = {
                    ...page_data,
                    ...JSON.parse(this.meta_data),
                }
            }

            console.log('Page Data', page_data);
            return await this.notion_client().pages.create(page_data);
        },
    },
    async run({ steps, $ }) {
        return await this.newPage();
    },
})


{
    {



        steps?.new_subject_by_urls?.$return_value.length === 0 ? '{}' : {
            Subjects: {
                relation: steps?.new_subject_by_urls?.$return_value.map(subject => {
                    id: subject.id
                })
            }
        }
    }
}
