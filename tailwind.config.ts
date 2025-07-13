import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // This is the correct path to scan for styles
    "./node_modules/@supabase/auth-ui-react/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;