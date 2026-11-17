import tseslint from "typescript-eslint";
import { entosIgnores, entosLanguageOptions } from "@entos/config/eslint/base.mjs";

export default tseslint.config(
  { ignores: entosIgnores },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ...entosLanguageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
