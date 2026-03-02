// This is the React entrypoint that mounts the App into the DOM.
// It also imports the global CSS styling that makes the portal look polished.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
