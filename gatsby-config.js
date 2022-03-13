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
            "primary-color": "#873bf4",
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
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
