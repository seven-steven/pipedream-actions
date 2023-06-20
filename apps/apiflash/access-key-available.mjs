// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Access Key Available',
  version: '0.0.1',
  key: 'api-flash-access-key-available',
  description: "Get an available access key from access keys user provided.",
  type: 'action',
  props: {
    access_keys: {
      type: 'string[]',
      label: 'Access Keys',
      description: 'Access Keys of [ApiFlash](https://apiflash.com/), find your [Access Key](https://apiflash.com/dashboard/access_keys), See the [doc](https://apiflash.com/documentation#introduction)',
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
      const keystore = await this.data.get('access_key') || {};
      // 从 this.assess_keys 中过滤出不存在于 data_store 中的 access key (即没有用过的 access_key)，直接返回
      const access_keys_never_used = assess_keys.filter(key => {
        if (keystore[key]) {
          return false;
        }
        return true;
      });
      // 如果有不存在于 data_store 中的 access key (即没有用过的 access_key)，就直接返回
      if (access_keys_never_used.length > 0) {
        return access_keys_never_used[0];
      }
      // 对 data_store 中的 access key 进行排序，按照剩余配额从大到小排序，如果配额相同，按照刷新时间从小到大排序
      const access_keys_sorted = Object.keys(keystore).sort((a, b) => {
        const quota_remaining_a = keystore[a]['x_quota_remaining'];
        const quota_remaining_b = keystore[b]['x_quota_remaining'];
        if (quota_remaining_a !== quota_remaining_b) {
          return quota_remaining_b - quota_remaining_a;
        }
        const x_quota_reset_a = keystore[a]['x_quota_reset'];
        const x_quota_reset_b = keystore[b]['x_quota_reset'];
        return x_quota_reset_a - x_quota_reset_b;
      });
      // 获取剩余配额最大 / 刷新时间最近的 access key
      const access_key = access_keys_sorted[0];
      return access_key;
    },
  },
  async run({ steps, $ }) {
    return await this.get_a_access_key();
  },
})