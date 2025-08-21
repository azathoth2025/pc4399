import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "lib",
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    typescript: true,
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
