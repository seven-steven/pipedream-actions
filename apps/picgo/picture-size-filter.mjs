import Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Picture Size Filter',
  version: '0.0.2',
  key: 'picture-size-filter',
  description: "Filter pictures by size",
  type: 'action',
  props: {
    urls: {
      type: 'string[]',
      label: 'Picture URLs',
      description: 'URLs of pictures which need to be filtered',
    },
    minWidth: {
      type: 'integer',
      label: 'Min Width',
      description: 'Min width of the picture',
      optional: true,
    },
    minHeight: {
      type: 'integer',
      label: 'Min Height',
      description: 'Min height of the picture',
      optional: true,
    },
    localDir: {
      type: 'string',
      label: 'Local Dir',
      description: 'Save net picture to specified local dir and return local path, would not save to local if not specified.',
      optional: true,
    },
    toFormat: {
      type: 'string',
      label: 'ToFormat',
      description: 'Force output to a given format. Effective only local Dir is not empty.',
      optional: true,
      default: 'webp',
      options: [
        'jpeg',
        'png',
        'webp',
        'gif',
        'jp2',
        'tiff',
        'avif',
        'heif',
        'jxl',
        'raw',
      ],
    }
  },
  methods: {
    async filterImage(url) {
      await Jimp.read({
        url,
      }).then((image) => {
        const width = image.getWidth();
        const height = image.getHeight();
        // 跳过不符合条件的图片
        if (!this.isSizeQualified(width, height)) {
          url = undefined;
          return;
        }

        const localDir = this.localDir;
        if (localDir) {
          const fileFormat = this.toFormat ? this.toFormat : metadata.format;
          const fileName = uuidv4() + '.' + fileFormat;
          const filePath = this.localDir + fileName;
          image.quality(100).write(filePath);
          url = filePath;
        }
      }).catch(err => {
        console.log(err);
      })

      return url;
    },
    isSizeQualified(width, height) {
      const widthQualified = !this.minWidth || this.minWidth <= 0 || width >= this.minWidth;
      const heightQualified = !this.minHeight || this.minHeight <= 0 || height >= this.minHeight;
      // 根据宽度和高度进行过滤条件判断

      console.log(this.minWidth, this.minHeight);
      console.log(widthQualified, heightQualified)
      return widthQualified && heightQualified;
    },
    async filterImages(urls) {
      let picturesQualified = [];
      await Promise.all(urls.map(async (url) => {
        const newUrl = await this.filterImage(url);
        if (newUrl) {
          picturesQualified.push(newUrl);
        }
      }))
      return picturesQualified;
    }
  },
  async run({ steps, $ }) {
    return await this.filterImages(this.urls || []);
  },
})