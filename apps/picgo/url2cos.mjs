import { PicGo } from 'picgo'
import crypto from 'crypto'

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Picture TO COS',
  version: '0.0.1',
  key: 'picture-of-url2tencent-cos',
  description: "Upload picture of URL to TencentCOS, see the [doc](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E8%85%BE%E8%AE%AF%E4%BA%91cos)",
  type: 'action',
  props: {
    urls: {
      type: 'string[]',
      label: 'Picture URLs',
      description: 'URL which need to be screenshot',
    },
    app_id: {
      type: 'string',
      label: 'App ID',
      description: 'App ID of Tencent COS',
    },
    secret_id: {
      type: 'string',
      label: 'Secret ID',
      description: 'Secret ID of Tencent COS',
    },
    secret_key: {
      type: 'string',
      label: 'Secret Key',
      description: 'Secret Key of Tencent COS',
    },
    bucket: {
      type: 'string',
      label: 'Bucket',
      description: 'Bucket of Tencent COS',
    },
    region: {
      type: 'string',
      label: 'Region',
      description: 'Region of Tencent COS',
    },
    path: {
      type: 'string',
      label: 'Path',
      description: 'Path of Tencent COS',
      optional: true,
    },
    custom_url: {
      type: 'string',
      label: 'Custom URL',
      description: 'Custom URL of Tencent COS',
      optional: true,
    },
    version: {
      type: 'string',
      label: 'Version',
      description: 'Version of Tencent COS',
      optional: true,
      options: [
        { label: 'v5', value: 'v5' },
        { label: 'v4', value: 'v4' },
      ],
      default: 'v5',
    },
  },
  methods: {
    config(picgo) {
      const config = {
        "picBed": {
          "uploader": "tcyun",
          "tcyun": {
            "secretId": this.secret_id,
            "secretKey": this.secret_key,
            "bucket": this.bucket,
            "appId": this.app_id,
            "area": this.region,
            "path": this.path,
            "customUrl": this.custom_url,
            "version": this.version || 'v5',
          }
        }
      };
      picgo.setConfig(config);
    },
    write_file(path, content) {
      const filename = `/tmp/${path}`
      try {
        fs.writeFileSync(filename, content);
        console.log(`文件 ${filename} 写入成功`);
        return filename;
      } catch (err) {
        // 处理错误
        throw err;
      }
    }
  },
  async run({ steps, $ }) {
    const picgo = new PicGo('/tmp/config.json');
    this.config(picgo);

    picgo.on('beforeUpload', ctx => {
      ctx.output.forEach(file => {
        const md5 = crypto.createHash('md5').update(file.buffer).digest('hex');
        file.fileName = `${md5}${file.extname}`;
      })
    })

    const result = await picgo.upload(this.urls);
    return result;
  },
})