import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initPalette } from "./lib/palette";
import "./index.css";

// Apply the saved (or OS-preferred) palette before the first paint so the
// app never flashes the wrong colours.
initPalette();

createRoot(document.getElementById("root")!).render(<App />);
