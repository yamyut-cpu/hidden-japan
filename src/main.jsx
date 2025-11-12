import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";  // ← ここが .jsx になっていること！

createRoot(document.getElementById("root")).render(<App />);
