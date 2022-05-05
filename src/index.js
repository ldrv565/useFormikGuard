import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./Routes";

function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));
