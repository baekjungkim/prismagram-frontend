import React from "react";
import { ApolloProvider } from "react-apollo-hooks";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "../Styles/GlobalStyles";
import Theme from "../Styles/Theme";
import Router from "./Router";
import Client from "../Apollo/Client";

export default () => (
  <ThemeProvider theme={Theme}>
    <ApolloProvider client={Client}>
      <GlobalStyles />
      <Router isLoggedIn={false} />
    </ApolloProvider>
  </ThemeProvider>
);
