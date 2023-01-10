import React from "react";
import { graphql, Link } from "gatsby";
import useSiteMetadata from "../useSiteMetadata";

const IndexPage = ({ data }) => {
  const { siteName } = useSiteMetadata();
  return (
    <main>
      <header>
        <h1>{siteName}</h1>
      </header>
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
  );
};

export default IndexPage;

export const query = graphql`
  query IndexPageQuery {
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
