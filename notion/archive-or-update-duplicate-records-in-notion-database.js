import { Client } from "@notionhq/client"
export default defineComponent({
  name: 'Archive Or Update duplicate records in Notion database',
  version: '0.0.2',
  key: 'archive-or-update-duplicate-records-in-notion-database',
  description: "Query records with specified Filter and Sorts, and then archive Or update duplicate records.",
  type: 'action',
  props: {
    notion: {
      type: "app",
      app: "notion",
    },
    database_id: {
      type: 'string',
      description: 'ID of the Database',
    },
    filter: {
      type: 'string',
      label: 'Filter',
      description: 'filter the duplicated records based on the specified criteria. [See the docs](https://developers.notion.com/reference/post-database-query-filter#the-filter-object)',
    },
    sorts: {
      type: 'string',
      label: 'Sorts',
      optional: true,
      description: 'This sort orders the database query by a particular property. [See the docs](https://developers.notion.com/reference/post-database-query-sort#sort-object)',
    },
    update_property: {
      type: 'string',
      label: "Update Property",
      optional: true,
      description: 'Update all records except the first one. This will be ignored if \'Archive Duplicates\' is specified.',
    },
    archive_duplicates: {
      type: 'boolean',
      label: 'Archive Duplicates',
      optional: true,
      description: 'Archive all records expect the first one',
    }
  },
  data() {
    return {
      notion_client: null,
    }
  },
  methods: {
    async query_duplicated_records() {
      return await this.notion_client.databases.query({
        database_id: this.database_id,
        filter: this.filter,
        sorts: this.sorts,
      });
    },

    init() {
      // init notion_client
      this.notion_client = new Client({ auth: `${this.notion.$auth.oauth_access_token}` });

      if (Boolean(this.filter) && typeof this.filter !== 'object') {
        this.filter = JSON.parse(this.filter);
      }

      if (Boolean(this.sorts) && typeof this.sorts !== 'array') {
        this.sorts = JSON.parse(this.sorts);
      }

      if (Boolean(this.update_property) && typeof this.update_property !== 'object') {
        this.update_property = JSON.parse(this.update_property);
      }
    },

    async update_duplicated_entry(entry) {
      if (!Boolean(entry)) {
        return;
      }
      return await this.notion_client.pages.update({
        page_id: entry.id,
        properties: this.update_property,
      })
    },

    async update_duplicated_records(records) {
      if (!Boolean(records)) {
        return;
      }
      await Promise.all(records.map(async e => await this.update_duplicated_entry(e)));
    },

    async archive_duplicated_records(records) {
      if (!Boolean(records)) {
        return;
      }
      await Promise.all(records.map(async entry => await this.notion_client.pages.update({
        page_id: entry.id,
        archived: true,
      })));
    },

    async solve_duplicated_records(records) {
      if (this.archive_duplicates) {
        await this.archive_duplicated_records(records);
        return;
      }
      if (Boolean(this.update_property)) {
        await this.update_duplicated_records(records);
        return;
      }
    }
  },

  async run({ steps, $ }) {
    this.init();

    let query_duplicated_records = await this.query_duplicated_records();
    console.log(query_duplicated_records)
    let duplicated_records = query_duplicated_records.results;
    if (!Boolean(duplicated_records)) {
      return;
    }
    let remain_entry = await duplicated_records.shift();
    if (duplicated_records.length > 0) {
      await this.solve_duplicated_records(duplicated_records);
    }
    return remain_entry;
  },
})