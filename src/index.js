import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";

import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  link: new WebSocketLink({
    // replace with your heroku app name
    uri: `wss://dangerous-tweets-marion.herokuapp.com/v1/graphql`,
    options: {
      reconnect: true
    }
  }),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
