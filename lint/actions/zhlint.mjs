import lint from "../lint.app.mjs";
import { zhlint } from "../common/zhlint.mjs";

export default {
  name: "Lint and fix Chinese text",
  version: "0.0.1",
  key: "lint-zh-fix",
  description: "Lint and fix Chinese text. See the [doc](https://github.com/Jinjiang/zhlint)",
  props: {
    lint,
    text: {
      type: "string",
      label: "Text",
      description: "Plain Text which need to be fixed.",
    },
  },
  type: "action",
  methods: {},
  async run() {
    return zhlint(this.text || "");
  },
};
