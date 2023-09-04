import gm from 'gm';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'ImageRoundCorner',
  version: '0.0.1',
  key: 'image-round-corner',
  description: "ImageRoundCorner.",
  type: 'action',
  props: {
    inputFilePath: {
      type: 'string',
      label: 'inputFilePath',
      description: 'inputFilePath',
    },
    outputFilePath: {
      type: 'string',
      label: 'OutputFilePath',
      description: 'OutputFilePath',
    },
    cornerRadius: {
      type: 'integer',
      label: 'CornerRadius',
      description: 'CornerRadius'
    }
  },
  methods: {
    async roundCorner(inputPath, outputPath, cornerRadius) {
      try {
        await new Promise((resolve, reject) => {
          gm(inputPath)
            .out('(') // 启用透明背景
            .coalesce() // 保留所有帧的透明度
            .out('-background', 'none') // 设置背景为透明
            .out('-virtual-pixel', 'transparent') // 设置虚拟像素为透明
            .out('-set', 'dispose', 'background') // 设置处理方法为background
            .out('-distort', 'SRT', '0,0 0,0 0') // 执行无变换的失真操作以避免错误
            .out(')') // 关闭透明背景
            .roundCorners(cornerRadius, cornerRadius)
            .write(outputPath, (error) => {
              if (error) {
                console.error('圆角化时发生错误:', error);
                reject(error);
              } else {
                console.log(`已成功圆角化并保存到文件 ${outputPath}`);
                resolve();
              }
            });
        });
      } catch (error) {
        console.error('发生错误:', error);
      }
    },
  },
  async run({ steps, $ }) {
    // Return data to use it in future steps
    const inputFilePath = this.inputFilePath;
    if (!inputFilePath) {
      return;
    }
    const outputFilePath = this.outputFilePath;
    await this.roundCorner(inputFilePath, outputFilePath, 50);
    return outputFilePath;
  },
})