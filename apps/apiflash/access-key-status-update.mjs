// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Access Key Status Update',
  version: '0.0.1',
  key: 'api-flash-access-key-status-update',
  description: "Update Status of provided access key",
  type: 'action',
  props: {
    access_key: {
      type: 'string',
      label: 'Access Key',
      description: 'Access Key to be updated',
    },
    x_quota_remaining: {
      type: 'integer',
      label: 'X-Quota-Remaining',
      description: 'X-Quota-Remaining',
    },
    x_quota_reset: {
      type: 'integer',
      label: 'X-Quota-Reset',
      description: 'X-Quota-Reset',
    },
    data: {
      type: 'data_store',
    }
  },
  methods: {
    async update_access_key_status() {
      if (!Boolean(this.access_key)) {
        return;
      }
      const x_quota_remaining = Boolean(this.x_quota_remaining) ? this.x_quota_remaining : 0;
      const x_quota_reset = Boolean(this.x_quota_reset) ? this.x_quota_reset : new Date().getTime() + 30 * 24 * 60 * 60;
      let keystore = await this.data.get('access_key') || {};
      keystore[this.access_key] = {
        x_quota_remaining,
        x_quota_reset,
      };
      await this.data.set(this.access_key, keystore);
    },
  },
  async run({ steps, $ }) {
    return await this.update_access_key_status();
  },
})