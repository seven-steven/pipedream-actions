import { PicGo } from 'picgo'
import { v4 as uuidv4 } from 'uuid';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Picture TO AliYunOSS',
  version: '0.0.1',
  key: 'picture-of-url2aliYunOSS',
  description: "Upload picture of URL to AliYunOSS",
  type: 'action',
  props: {
    urls: {
      type: 'string[]',
      label: 'Picture URLs',
      description: 'URLs of pictures which need to be upload to AliYunOSS',
    },
    assessKeyId: {
      type: 'string',
      label: 'accessKeyId',
      description: 'accessKeyId of AliYunOSS',
    },
    assessKeySecret: {
      type: 'string',
      label: 'accessKeySecret',
      description: 'accessKeySecret of AliYunOSS',
    },
    bucket: {
      type: 'string',
      label: 'Bucket',
      description: 'Bucket of AliYunOSS',
    },
    area: {
      type: 'string',
      label: 'area',
      description: 'area of AliYunOSS',
    },
    path: {
      type: 'string',
      label: 'Path',
      description: 'Path of AliYunOSS',
      optional: true,
    },
    customUrl: {
      type: 'string',
      label: 'Custom URL',
      description: 'Custom URL of AliYunOSS',
      optional: true,
    },
    options: {
      type: 'string',
      label: 'Options',
      description: 'Options of AliYunOSS',
      optional: true,
    },
  },
  methods: {
    config(picgo) {
      const config = {
        "picBed": {
          "uploader": "aliyun",
          "aliyun": {
            "accessKeyId": this.assessKeyId,
            "accessKeySecret": this.assessKeySecret,
            "bucket": this.bucket,
            "area": this.area,
            "path": this.path,
            "customUrl": this.customUrl,
            "options": this.options,
          },
        }
      };
      picgo.setConfig(config);
      picgo.on('beforeUpload', ctx => {
        ctx.output.forEach(file => {
          // const md5 = crypto.createHash('md5').update(file.buffer).digest('hex');
          // file.fileName = `${md5}${file.extname}`;
          const fileName = uuidv4().replaceAll('-', '');
          file.fileName = `${fileName}${file.extname}`;
        })
      })
    },
    picgoInstance() {
      const picgo = new PicGo('/tmp/config.json');
      this.config(picgo);
      return picgo;
    },
  },
  async run({ steps, $ }) {
    const picgo = this.picgoInstance();
    return await picgo.upload(this.urls);
  },
})