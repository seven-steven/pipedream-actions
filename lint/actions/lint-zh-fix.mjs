import lint from "../lint.app.mjs";
import lintZhFix from "../common/lint-zh-fix.mjs";

export default {
  name: "Lint and fix Chinese text",
  version: "0.0.1",
  key: "lint-zh-fix",
  description: "Lint and fix Chinese text. See the [doc](https://github.com/Jinjiang/zhlint)",
  type: "action",
  props: {
    lint,
    text: {
      type: "string",
      label: "Text",
      description: "Plain Text which need to be fixed.",
    },
  },
  methods: {},
  async run() {
    this.text = '你好word,真厉害'
    return lintZhFix(this.text || "");
  },
};
