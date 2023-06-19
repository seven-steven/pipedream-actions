// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  props: {
    access_keys: {
      type: 'string[]',
      label: 'Access Keys',
      description: 'Access Keys of [ApiFlash](https://apiflash.com/), [find your Access Key](https://apiflash.com/dashboard/access_keys), [See the doc](https://apiflash.com/documentation#introduction)',
      optional: false,
    },
    data: {
      type: 'data_store',
    }
  },
  methods: {
    async get_a_access_key() {
      // 获取一个可用的 access key
      // 先获取所有的 access key
      let assess_keys = this.access_keys;
      if (!Boolean(assess_keys) || assess_keys.length < 1) {
        console.log('access keys 为空，退出流程。')
        return;
      }
      if (!Array.isArray(assess_keys)) {
        access_keys = JSON.parse(assess_keys);
      }
      // 获取 key_store 中的所有 access key
      // const data = {
      //   access_key: {
      //     key1: {
      //       'X-Quota-Remaining': 0,
      //       'X-Quota-Limit': 1000,
      //       'X-Quota-Reset': '2021-10-01T00:00:00Z'
      //     },
      //     key2: {
      //       'X-Quota-Remaining': 0,
      //       'X-Quota-Limit': 1000,
      //       'X-Quota-Reset': '2021-10-01T00:00:00Z'
      //     }
      //   }
      // };
      const access_keys_from_data_store = await this.data.get('access_key') || {};
      // 从 this.assess_keys 中过滤出不存在于 data_store 中的 access key (即没有用过的 access_key)，直接返回
      const access_keys_never_used = assess_keys.filter(key => {
        if (access_keys_from_data_store[key]) {
          return false;
        }
        return true;
      });
      // 如果有不存在于 data_store 中的 access key (即没有用过的 access_key)，就直接返回
      if (access_keys_never_used.length > 0) {
        return access_keys_never_used[0];
      }
      // 对 data_store 中的 access key 进行排序，按照剩余配额从大到小排序
      const access_keys_sorted = Object.keys(access_keys_from_data_store).sort((a, b) => {
        const quota_remaining_a = access_keys_from_data_store[a]['X-Quota-Remaining'];
        const quota_remaining_b = access_keys_from_data_store[b]['X-Quota-Remaining'];
        return quota_remaining_b - quota_remaining_a;
      });
      // 获取剩余配额最大的 access key
      const access_key = access_keys_sorted[0];
      // 如果剩余配额大于 0，就直接返回
      if (access_keys_from_data_store[access_key]['X-Quota-Remaining'] > 0) {
        return access_key;
      }
      // 如果剩余配额小于 1，就返回 null
      return null;
    },
  },
  async run({ steps, $ }) {
    return await this.get_a_access_key();
  },
})