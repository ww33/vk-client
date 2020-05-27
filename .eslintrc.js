module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/recommended",
    "@vue/typescript",
    "prettier",
    "prettier/standard"
  ],
  //plugins: ['vue', 'prettier'],

  plugins: ["vue"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "@typescript-eslint/no-use-before-define": ["error", {functions: false}],
    "@typescript-eslint/no-explicit-any": "off",
    "vue/html-closing-bracket-newline": 0,
    "vue/html-closing-bracket-spacing": 0,
    "@typescript-eslint/explicit-function-return-type": false,
    //'prettier/prettier': 1,
    "vue/max-attributes-per-line": [0,
      {
        "singleline": 1,
        "multiline": {
          "max": 1,
          "allowFirstLine": true
        }
      }
    ],
    "@typescript-eslint/no-empty-interface": 0, // TODO: fix it
    "@typescript-eslint/interface-name-prefix": 0, // TODO: fix it
    "@typescript-eslint/camelcase": 0 // TODO: fix it
    //"@typescript-eslint/camelcase": ["error", {"properties": "never"}]
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
