import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { FlatCompat } from "@eslint/eslintrc";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { extends: ["plugin:react/jsx-runtime"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
