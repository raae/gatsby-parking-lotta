import { useStaticQuery, graphql } from "gatsby";

const useSiteMetadata = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteName
          }
        }
      }
    `
  );

  return siteMetadata;
};

export default useSiteMetadata;
