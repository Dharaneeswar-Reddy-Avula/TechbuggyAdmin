import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import './index.css'
import { ThemeProvider } from "./Components/themeProvider/ThemeContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider> {/* ✅ wrap App with ThemeProvider */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
