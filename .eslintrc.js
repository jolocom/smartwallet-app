module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["standard", "standard-jsx", "plugin:react/recommended"],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "eqeqeq": "error",
        "curly": "error",
        "no-console": "warn",
        "max-len": [
          "error"
        ],
        "keyword-spacing": [
          "error",
          {"before": true, "after": true}
        ],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "space-before-function-paren": [
          "off"
        ],
        "react/wrap-multilines": "error",
        "react/jsx-uses-react": "error"
    }
};
