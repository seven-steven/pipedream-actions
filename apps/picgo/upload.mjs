import { PicGo } from 'picgo'

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
            "secretId": "AKID50ylLhsXyCBe6LLG1b0FI8i4xhDTE3jC",
            "secretKey": "JOKh0Kk6GRPCmDTXQ9f0A9wfS3Xr23wi",
            "bucket": "contentcenter-1315725764", // 存储桶名，v4 和 v5 版本不一样
            "appId": "1315725764",
            "area": "ap-shanghai", // 存储区域，例如 ap-beijing-1
            "path": "tools/bgs/", // 自定义存储路径，比如 img/
            "customUrl": "https://content.zhinan.pro", // 自定义域名，注意要加 http://或者 https://
            "version": "v5" // COS 版本，v4 或者 v5
          }
        }
      })
    },
  },
  async run({ steps, $ }) {
    const picgo = new PicGo();
    this.config(picgo);
    const res = await picgo.upload([
      'https://api.apiflash.com/v1/urltoimage/cache/m1pm3v5py1.webp?access_key=b72022f2f4474e3c9d8e49172891eda3'
    ]);
    return res;
  },
})