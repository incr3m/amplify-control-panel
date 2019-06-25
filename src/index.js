import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "react-apollo-hooks";
import { SnackbarProvider } from "notistack";
import { client } from "./common/apollo";

const AppWrapper = () => (
  <ApolloProvider client={client}>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </ApolloProvider>
);

ReactDOM.render(<AppWrapper />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
