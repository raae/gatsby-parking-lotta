module.exports = {
  siteMetadata: {
    siteName: `Parking Lotta`,
  },
  plugins: [
    `@raae/gatsby-plugin-new-css`,
    {
      resolve: "@raae/gatsby-plugin-svg-emoji-favicon",
      options: {
        emoji: "🅿️",
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./lots/`,
      },
    },
  ],
};
