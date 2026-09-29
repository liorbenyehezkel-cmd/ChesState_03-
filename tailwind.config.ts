import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Only `navy` is a confirmed brand value. The rest are reconstructed
        // by eye from the reference screenshots — see README "Known gaps".
        navy: "#0B1D33",
        cream: "#F8F6F0",
        card: "#FFFFFF",
        mint: "#3EA88C",
        // Darkened accent for cases where mint is used as text on cream,
        // where the raw mint does not clear WCAG AA.
        "mint-ink": "#1F6E5A",
        // Quiet brass used on the news desk and as a shared brand hairline.
        gold: "#E8C97A",
        muted: "#6E6B63",
        border: "#E7E2D6",
      },
      fontFamily: {
        serif: [
          "var(--font-fraunces)",
          "Noto Naskh Arabic",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-inter)",
          "Segoe UI",
          "Tahoma",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 29, 51, 0.04), 0 12px 32px -12px rgba(11, 29, 51, 0.12)",
        nav: "0 1px 0 rgba(231, 226, 214, 1), 0 8px 24px -20px rgba(11, 29, 51, 0.4)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
