/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
  siteMetadata: {
    author: 'visiky',
    title: `❤️ Plot performance test`,
    siteUrl: `https://visiky.github.io/plot-performance/`,
  },
  pathPrefix: '/plot-performance',
  plugins: [
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-antd",
      options: {
        style: true,
      },
    },
    {
      resolve: "gatsby-plugin-less",
      options: {
        strictMath: true,
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            "primary-color": "rgb(39, 63, 117)",
            "font-family": "Arial",
          },
        },
      },
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "G-HWKMMN50JG",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-remark",
  ],
};
