import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider as ApolloProviderHooks } from "react-apollo-hooks";
import { ApolloProvider } from "@apollo/react-hooks";
import { SnackbarProvider } from "notistack";
import { client } from "./common/apollo";
import Basket from "./Basket";
import HomeIcon from "@material-ui/icons/Home";
import MailIcon from "@material-ui/icons/Mail";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const AppWrapper = () => (
  <Router>
    <ApolloProvider client={client}>
      <ApolloProviderHooks client={client}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </ApolloProviderHooks>
    </ApolloProvider>
  </Router>
);

ReactDOM.render(<AppWrapper />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
