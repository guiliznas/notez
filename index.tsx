import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("[INDEX] Iniciando aplicação...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("Iniciando react");

const root = ReactDOM.createRoot(rootElement);
console.log("[INDEX] Root element encontrado, montando React...");
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log("[INDEX] React montado com sucesso!");
