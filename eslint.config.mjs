import globals from "globals";
import { defineConfig } from "eslint/config";
import pluginJs from "@eslint/js";

export default defineConfig([
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
]);
