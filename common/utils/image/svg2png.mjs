import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'SVG2PNG',
  version: '0.0.1',
  key: 'svg2Png',
  description: "SVG2PNG, see the [doc](https://github.com/yisibl/resvg-js) [playground](https://resvg-js.vercel.app/).",
  type: 'action',
  props: {
    svgFilePath: {
      type: 'string',
      label: 'svgFilePath',
      description: 'Local Path Of the svg file.',
    },
    pngFilePath: {
      type: 'string',
      label: 'PNGFilePath',
      description: 'Output PNG FilePath, where the png file will be write in. Must start with `/tmp`, Should be **`png`** format.',
    },
    fontFiles: {
      type: 'string[]',
      label: 'FontFiles',
      description: 'Local Path Of the FontFiles.',
      optional: true,
    },
    defaultFontFamily: {
      type: 'string[]',
      label: 'DefaultFontFamily',
      description: 'Default Font Family.',
      optional: true,
    },
    background: {
      type: 'string[]',
      label: 'Background',
      description: 'Background of the png file. eg: rgb(0, 0, 0).',
      optional: true,
    },
    outputFileWidth: {
      type: 'integer',
      label: 'Output png file width.',
      description: 'output png file width which the svg will be fitted to',
      optional: true,
    }
  },
  methods: {
    async svgContent2png(svgContent, pngPath) {
      let opts = {
        font: {
          loadSystemFonts: false,
        }
      };
      if (this.background) {
        opts.background = this.background;
      }
      if (this.fontFiles) {
        opts.font.fontFiles = this.fontFiles;
      }
      if (this.defaultFontFamily) {
        opts.font.defaultFontFamily = this.defaultFontFamily;
      }
      if (this.outputFileWidth) {
        opts.fitTo = {
          mode: 'width',
          value: this.outputFileWidth,
        }
      }

      try {
        const resvg = new Resvg(svgContent, opts);
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        // console.info('Original SVG Size:', `${resvg.width} x ${resvg.height}`);
        // console.info('Output PNG Size  :', `${pngData.width} x ${pngData.height}`);

        fs.writeFileSync(pngPath, pngBuffer);
        return outputFilePath;
      } catch (error) {
        // 处理错误
        console.log(error);
        return;
      }
    },
    async svgFile2png(svgPath, pngPath) {
      const svg = fs.readFileSync(svgPath);
      return await this.svgContent2png(svg, pngPath);
    },
  },
  async run({ steps, $ }) {
    return this.svgFile2png(this.svgFilePath, this.pngFilePath);
  }
})