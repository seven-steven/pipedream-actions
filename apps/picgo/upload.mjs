import { Picgo } from 'picgo';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  // name: 'Url2Pic',
  // version: '0.0.1',
  // key: 'api-flash-url2pic',
  // description: "Capture screenshot of URL and return url of the screenshot",
  // type: 'action',
  // props: {
  //   access_key: {
  //     type: 'string',
  //     label: 'Access Key',
  //     description: 'Access Keys of [ApiFlash](https://apiflash.com/), find your [Access Key](https://apiflash.com/dashboard/access_keys), See the [doc](https://apiflash.com/documentation#introduction)',
  //   },
  //   url: {
  //     type: 'string',
  //     label: 'URL',
  //     description: 'URL which need to be screenshot',
  //   },
  //   params: {
  //     type: 'string',
  //     label: 'Params',
  //     description: 'Additional JSON Params of [ApiFlash](https://apiflash.com/), See the [doc](https://apiflash.com/documentation#introduction)',
  //     optional: true,
  //   },
  // },
  methods: {
    config(picgo) {
      picgo.config({
        "picBed": {
          "uploader": "tcyun",
          "tcyun": {
            "secretId": "",
            "secretKey": "",
            "bucket": "", // 存储桶名，v4 和 v5 版本不一样
            "appId": "",
            "area": "", // 存储区域，例如 ap-beijing-1
            "path": "", // 自定义存储路径，比如 img/
            "customUrl": "", // 自定义域名，注意要加 http://或者 https://
            "version": "v5" | "v4" // COS 版本，v4 或者 v5
          }
        }
      })
    },
  },
  async run({ steps, $ }) {

  },
})