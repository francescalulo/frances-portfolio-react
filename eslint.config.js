import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

// ESLint 9 flat config (same setup as the current Vite React template, plus eslint-plugin-react)
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"], // React 17+ JSX: no need to import React
      reactHooks.configs.flat.recommended, // Rules of Hooks + React Compiler checks
      reactRefresh.configs.vite, // keeps Vite's fast refresh working
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } }, // reads React 19 from package.json
    rules: {
      "react/prop-types": "off", // no PropTypes in this project
    },
  },
]);
