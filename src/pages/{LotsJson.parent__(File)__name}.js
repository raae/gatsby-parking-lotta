import React from "react";
import { graphql, Link } from "gatsby";
import useSiteMetadata from "../useSiteMetadata";
import LotApp from "../lot-app";

const LotPage = ({ data }) => {
  const { siteName } = useSiteMetadata();
  return (
    <>
      <header>
        <h1>{siteName}</h1>
        <nav>
          <Link to="/">Home</Link>
          {data.allLotsJson.nodes.map(({ name, lotPath }, key) => {
            return (
              <span key={key}>
                <span aria-hidden="true"> / </span>
                <Link to={lotPath} key={lotPath}>
                  {name}
                </Link>
              </span>
            );
          })}
        </nav>
      </header>
      <main>
        <LotApp {...data.lotsJson} />
      </main>
    </>
  );
};

export const query = graphql`
  query LotById($id: String!) {
    lotsJson(id: { eq: $id }) {
      name
      floors {
        name
        spaces
      }
    }
    allLotsJson(sort: { name: ASC }) {
      nodes {
        name
        lotPath: gatsbyPath(filePath: "/{LotsJson.parent__(File)__name}")
      }
    }
  }
`;

export default LotPage;

export const Head = ({ data }) => {
  const { name } = data.lotsJson;
  const { siteName } = useSiteMetadata();
  return (
    <>
      <title>
        {name} / {siteName}
      </title>
    </>
  );
};
