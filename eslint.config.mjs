// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config({
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        eslintConfigPrettier,
        {
            languageOptions: {
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: import.meta.dirname,
                },
            },
        },
    ],
    rules: {
        "no-console": "error",
        "dot-notation": "error",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-unused-vars": "off",
    },
    ignores: [
        "dist/**",
        "node_modules/**",
        "**/*.config.mjs",
        "**/*.js",
        "scripts/**/*.mjs",
        "*.spec.ts",
        "tests/**",
        "*.js",
    ],
});
