import axios from 'axios';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Url2Pic',
  version: '0.0.3',
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
    },
    async screenshotToBase64() {
      const additional_params = Boolean(this.params) ? JSON.parse(this.params) : {};
      const response = await axios({
        url: `https://api.apiflash.com/v1/urltoimage`,
        params: {
          access_key: this.access_key,
          url: this.url,
          response_type: 'image',
          ...additional_params,
        },
      })
      const base64Data = Buffer.from(response.data, 'binary').toString('base64');
      return `data:${response.headers['content-type']};base64,${base64Data}`;
    },
  },
  async run({ steps, $ }) {
    const screenshot = await this.screenshot();
    console.log(screenshot);
    return {
      url: screenshot.data.url,
      x_quota_remaining: screenshot.headers['x-quota-remaining'],
      x_quota_limit: screenshot.headers['x-quota-limit'],
      x_quota_reset: screenshot.headers['x-quota-reset'],
    };
  },
})