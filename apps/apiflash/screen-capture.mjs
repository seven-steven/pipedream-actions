import axios from 'axios';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  props: {
    params: {
      type: 'string',
      label: 'Params',
      description: 'Params of [ApiFlash](https://apiflash.com/), [See the doc](https://apiflash.com/documentation#introduction)',
    },
  },
  methods: {
    async screenshot(url, $) {
      return await axios({
        url: `https://api.apiflash.com/v1/urltoimage`,
        params: {
          access_key: `${this.apiflash.$auth.access_key}`,
          url,
          width: 1920,
          height: 1080,
          format: 'webp',
          full_page: false,
          quality: 80,
          response_type: 'json',
          no_cookie_banners: true,
          no_ads: true,
          no_tracking: true,
          wait_until: 'network_idle',
          latitude: 31.05,
          longitude: 121.48,
        },
      })
    }
  },
  async run({ steps, $ }) {
    const url = steps?.trigger?.event?.properties["地址"]?.url || '';
    if (!url) {
      console.log('工具 url 为空，退出流程。')
      $.flow.exit();
    }
    const screenshot = await this.screenshot(url, $);
    const background_url = screenshot?.data?.url;
    console.log(background_url);
    // Return data to use it in future steps
    return steps.trigger.event
  },
})