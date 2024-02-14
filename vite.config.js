import { defineConfig } from "vite";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react";

dotenv.config();

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  define: {
    // Expose environment variables to the Vite project
    "import.meta.env.PROJECT_ID": JSON.stringify(process.env.PROJECT_ID),
    "import.meta.env.DATABASE_ID": JSON.stringify(process.env.DATABASE_ID),
    "import.meta.env.USER_COLLECTION_ID": JSON.stringify(
      process.env.USER_COLLECTION_ID
    ),
    "import.meta.env.CLIENT_COLLECTION_ID": JSON.stringify(
      process.env.CLIENT_COLLECTION_ID
    ),
  },
});
