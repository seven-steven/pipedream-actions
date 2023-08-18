import { run } from "zhlint";

function zhlint(text) {
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

export {
  zhlint,
};
