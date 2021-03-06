require('dotenv').config()

module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL
  },
}
