import sharp from 'sharp';
import { axios } from "@pipedream/platform";
import { v4 as uuidv4 } from 'uuid';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Picture Size Filter',
  version: '0.0.1',
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
    // 获取网络图片的宽度和高度
    async getImageSize(url) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      let sharpProcessor = sharp(buffer);
      const metadata = await sharpProcessor.metadata();
      console.log(metadata);
      const width = metadata.width;
      const height = metadata.height;

      const localDir = this.localDir;
      if (localDir) {
        const fileFormat = this.toFormat ? this.toFormat : metadata.format;
        const fileName = uuidv4() + '.' + fileFormat;
        const filePath = this.localDir + '/' + fileName;
        sharpProcessor.rotate()
          .toFile(filePath);
      }

      return {
        width,
        height,
        fileFormat,
        url: localDir ? filePath : url,
      };
    },
    // 过滤图片
    async filterImages(imageUrls) {
      const filteredImages = [];

      for (const imageUrl of imageUrls) {
        try {
          const imageInfo = await getImageSize(imageUrl);
          const widthQualified = !this.minWidth || this.minWidth <= 0 || imageInfo.width >= this.minWidth;
          const heightQualified = !this.minHeight || this.minHeight <= 0 || imageInfo.Height >= this.minHeight;
          // 根据宽度和高度进行过滤条件判断
          if (widthQualified && heightQualified) {
            filteredImages.push(imageInfo.url);
          }
        } catch (error) {
          console.error(`无法获取图片的宽度和高度：${error}`);
        }
      }

      return filteredImages;
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
    // 测试例子
    const imageUrls = this.urls || [];

    const picturesQualified = this.filterImages(imageUrls);
    return picturesQualified;
  },
})