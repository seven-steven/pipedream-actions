import { run } from "zhlint";

function lintZhFix(text) {
  if (!text) {
    return "";
  }

  const options = {
    rules: {
      preset: "default",
    },
  };
  const output = run(text, options);
  return output.result;
}

export default {
  lintZhFix,
};
