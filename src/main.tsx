// Read before the Supabase client strips the auth hash from the URL.
import "./lib/authLanding";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
