export default {
  "*.{js,jsx,less,md,json}": [
    "prettier --write"
  ],
  "*.{ts,tsx}": [
    "eslint --fix"
  ]
}
