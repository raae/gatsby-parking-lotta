import React from "react";
import { graphql, Link } from "gatsby";
import useSiteMetadata from "../useSiteMetadata";

const NotFoundPage = ({ data }) => {
  const { siteName } = useSiteMetadata();
  return (
    <>
      <header>
        <h1>{siteName}</h1>
      </header>
      <main>
        <h2>Page Not Found</h2>
        <p>Maybe your are looking for:</p>
        <ul>
          {data.allLotsJson.nodes.map(({ name, lotPath }) => {
            return (
              <li key={lotPath}>
                <Link to={lotPath}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default NotFoundPage;

export const query = graphql`
  query PageNotFoundPageQuery {
    allLotsJson(sort: { name: ASC }) {
      nodes {
        name
        lotPath: gatsbyPath(filePath: "/{LotsJson.parent__(File)__name}")
      }
    }
  }
`;

export const Head = () => {
  const { siteName } = useSiteMetadata();
  return (
    <>
      <title>{siteName}</title>;
    </>
  );
};
