import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          'Geist',
          'Inter',
          'Space Grotesk',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'Geist Mono',
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
        body: [
          'Inter',
          'Geist',
          'Space Grotesk',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;
