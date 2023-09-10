import { Client } from "@notionhq/client"
export default defineComponent({
  name: 'Append Value of properties in Database',
  version: '0.0.1',
  key: 'append-value-of-properties-in-database',
  description: "Append Value of properties in Database",
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
      description: 'Properties and values which need to be append',
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
    /**
     * 使用 pageId 查询 Notion Page
     * @param {string} pageId pageId
     * @returns Notion Page
     */
    async queryPage(pageId) {
      return await this.notionClient().pages.retrieve({
        page_id: pageId,
      })
    },
    /**
     * 更新 Notion page 属性
     * @param {string} pageId pageId
     * @param {object} properties Notion Page Properties
     * @returns Notion Page
     */
    async updatePage(pageId, properties) {
      return await this.notionClient().pages.update({
        page_id: pageId,
        properties,
      });
    },
    /**
     * 判断两个对象属性是否相同
     * @param {object} base object1
     * @param {object} compare object2
     * @returns 是否相同
     */
    commonPropertiesSame(base, compare) {
      const keyList = Object.keys(base);
      for (let key of keyList) {
        if (base?.[key] !== compare?.[key]) {
          return false;
        }
      }
      return true;
    },
    /**
     * 在已有的 Properties Value 之后追加新的 Value
     * @param {string} pageId pageId
     * @param {object} properties Notion Page Properties
     */
    async appendValueOfProperties(pageId, properties) {
      const page = await this.queryPage(pageId);
      const existProperties = page?.properties || {};
      const newProperties = Object.keys(properties).map(key => {
        const existProperty = existProperties?.[key] || {};
        const existPropertyType = existProperty?.type;
        const existPropertyValue = existProperty?.[existPropertyType] || undefined;
        const isArray = Array.isArray(existPropertyValue);
        // 如果新属性不是 array, 直接使用新值替换旧值而非追加
        if (!isArray) {
          return {
            [key]: {
              ...properties[key],
            }
          }
        }
        const newPropertyValue = properties?.[key]?.[existPropertyType] || [];
        const newValue = [...existPropertyValue, ...newPropertyValue.filter(newItem => existPropertyValue.every(existItem => !this.commonPropertiesSame(newItem, existItem)))];
        return {
          [key]: {
            type: existPropertyType,
            [existPropertyType]: newValue,
          }
        }
      }).filter(property => Boolean(property))
        .reduce((last, current) => {
          return { ...last, ...current };
        }, {});
      console.log(JSON.stringify(newProperties))
      return await this.updatePage(pageId, newProperties);
    },
    /**
     * 给指定的 Page 的相同 properties 批量追加新的 value
     * @param {string} pageIdList pageId
     * @param {object} properties CommonProperties Of a Page
     * @returns Notion Page List Updated
     */
    async appendCommonValueOfPropertiesBatch(pageIdList, properties) {
      return await Promise.all(pageIdList.map(async (pageId) => {
        return await this.appendValueOfProperties(pageId, properties);
      }))
    }
  },
  async run({ steps, $ }) {
    const pageIdList = this.page_id_list || [];
    const properties = JSON.parse(this.properties);
    return this.appendCommonValueOfPropertiesBatch(pageIdList, properties);
  },
})
