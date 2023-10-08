import { axios } from 'axios';
import { cheerio, html } from 'cheerio';

export default defineComponent({
  name: 'Fetch HTML DOM',
  version: '0.0.1',
  key: 'fetch-html-dom',
  description: "Fetch DOM From HTML Page By URL and Selector.",
  type: 'action',
  props: {
    url: {
      type: 'string',
      label: 'URL',
      description: 'URL of the HTML page.',
    },
    selector: {
      type: 'string',
      label: 'Selector',
      description: 'Selector of the target DOM.'
    }
  },

  methods: {
    /**
     * 根据网页 URL 获取网页 HTML 代码
     * @param {string} url 网页地址
     * @returns 网页 HTML 代码
     */
    async fetchHTML(url) {
      if (!url) {
        return;
      }

      const response = await axios.get(url);
      return response?.data;
    },
    querySelectorFromHTMLText(htmlText, selector) {
      const $ = cheerio.load(htmlText);
      const dom = $(selector).text();
      return dom;
    }
  },
  async run({ steps, $ }) {
    const htmlText = this.fetchHTML(this.url);
    return this.querySelectorFromHTMLText(htmlText, selector);
  },
})
