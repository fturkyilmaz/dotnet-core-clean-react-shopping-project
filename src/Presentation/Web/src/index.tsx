import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ProductProvider } from "./context/productContext.jsx";
import { BasketProvider } from "./context/basketContext.jsx";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/themeContext";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ProductProvider>
        <BasketProvider>
          <App />
          <ToastContainer autoClose={2500} />
        </BasketProvider>
      </ProductProvider>
    </ThemeProvider>
  </StrictMode>
);
