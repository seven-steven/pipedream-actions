import { Client } from "@notionhq/client"
export default defineComponent({
  name: 'Archive Or Update duplicate records in Notion database',
  version: '0.0.4',
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
      description: 'filter the duplicate records based on the specified criteria. [See the docs](https://developers.notion.com/reference/post-database-query-filter#the-filter-object)',
    },
    sorts: {
      type: 'string',
      label: 'Sorts',
      optional: true,
      description: 'This sort orders the database query by a particular property. [See the docs](https://developers.notion.com/reference/post-database-query-sort#sort-object)',
    },
    update_property_for_duplicate_records: {
      type: 'string',
      label: "Update Property For **duplicate** records",
      optional: true,
      description: 'Update all records except the first one. This will be ignored if \'Archive Duplicates\' is specified.',
    },
    update_property_for_remain_records: {
      type: 'string',
      label: "Update Property For <b>remain</b> records",
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
    async query_duplicate_records() {
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

      if (Boolean(this.update_property_for_duplicate_records) && typeof this.update_property_for_duplicate_records !== 'object') {
        this.update_property_for_duplicate_records = JSON.parse(this.update_property_for_duplicate_records);
      }

      if (Boolean(this.update_property_for_remain_records) && typeof this.update_property_for_remain_records !== 'object') {
        this.update_property_for_remain_records = JSON.parse(this.update_property_for_remain_records);
      }
    },

    async update_entry(entry, properties) {
      if (!Boolean(entry)) {
        return;
      }

      if (!Boolean(properties)) {
        return;
      }

      return await this.notion_client.pages.update({
        page_id: entry.id,
        properties,
      })
    },

    async update_duplicate_records(records) {
      await Promise.all(records.map(async e => await this.update_entry(e, this.update_property_for_duplicate_records)));
    },

    async archive_duplicate_records(records) {
      if (!Boolean(records)) {
        return;
      }
      await Promise.all(records.map(async entry => await this.notion_client.pages.update({
        page_id: entry.id,
        archived: true,
      })));
    },

    async solve_duplicate_records(records) {
      if (this.archive_duplicates) {
        await this.archive_duplicate_records(records);
        return;
      }
      if (Boolean(this.update_property_for_duplicate_records)) {
        await this.update_duplicate_records(records);
        return;
      }
    }
  },

  async run({ steps, $ }) {
    this.init();

    let query_duplicate_records = await this.query_duplicate_records();
    console.log(query_duplicate_records)
    let duplicate_records = query_duplicate_records.results;
    if (!Boolean(duplicate_records)) {
      return;
    }
    let remain_record = await duplicate_records.shift();
    if (duplicate_records.length > 0) {
      await this.solve_duplicate_records(duplicate_records);
    }

    if (Boolean(this.update_property_for_remain_records)) {
      remain_record = await this.update_entry(remain_record, this.update_property_for_remain_records);
    }

    return {
      remain_record,
      duplicate_records
    };
  },
})