/**
 * Shared ESLint flat config pieces for Entos packages.
 * Apps extend this and add their own ignore/globals as needed.
 */
export const entosIgnores = ["**/dist/**", "**/node_modules/**", "**/.turbo/**"];

export const entosLanguageOptions = {
  ecmaVersion: 2022,
  sourceType: "module",
};
