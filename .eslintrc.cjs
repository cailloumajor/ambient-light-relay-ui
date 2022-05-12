const tsConfig = require("./tsconfig.json")
const internalPathPatterns = Object.keys(tsConfig.compilerOptions.paths)
  .filter((pat) => pat.endsWith("/*"))
  .map((pat) => pat.slice(0, -2))
  .join(",")
const internalPathGlob = `{${internalPathPatterns}}/**`

require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
  ],

  plugins: ["import"],

  rules: {
    quotes: ["warn", "double", { avoidEscape: true }],

    // enforce usage of type-only imports (recommended with Vite)
    // https://vitejs.dev/guide/features.html#typescript
    "@typescript-eslint/consistent-type-imports": "error",

    // allow debugger during development only
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: { order: "asc" },
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        pathGroups: [
          {
            pattern: internalPathGlob,
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin", "type"],
      },
    ],

    "sort-imports": ["error", { ignoreDeclarationSort: true }],
  },

  env: {
    "vue/setup-compiler-macros": true,
  },
}
