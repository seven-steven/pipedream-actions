import axios from 'axios';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Url2Pic',
  version: '0.0.1',
  key: 'api-flash-url2pic',
  description: "Capture screenshot of URL and return url of the screenshot",
  type: 'action',
  props: {
    access_key: {
      type: 'string',
      label: 'Access Key',
      description: 'Access Keys of [ApiFlash](https://apiflash.com/), find your [Access Key](https://apiflash.com/dashboard/access_keys), See the [doc](https://apiflash.com/documentation#introduction)',
    },
    url: {
      type: 'string',
      label: 'URL',
      description: 'URL which need to be screenshot',
    },
    params: {
      type: 'string',
      label: 'Params',
      description: 'Additional JSON Params of [ApiFlash](https://apiflash.com/), See the [doc](https://apiflash.com/documentation#introduction)',
      optional: true,
    },
  },
  methods: {
    async screenshot() {
      const additional_params = Boolean(this.params) ? JSON.parse(this.params) : {};
      return await axios({
        url: `https://api.apiflash.com/v1/urltoimage`,
        params: {
          access_key: this.access_key,
          url: this.url,
          ...additional_params,
        },
      })
    }
  },
  async run({ steps, $ }) {
    const screenshot = await this.screenshot();
    return screenshot;
  },
})