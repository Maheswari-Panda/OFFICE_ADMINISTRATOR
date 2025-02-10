import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserAuth from "./context/user/UserAuth.jsx";
import DocumentState from "./context/document/DocumentState.jsx";
import OfficeState from "./context/office/OfficeState.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserAuth>
      <DocumentState>
        <OfficeState>
          <App />
        </OfficeState>
      </DocumentState>
    </UserAuth>
  </StrictMode>
);
