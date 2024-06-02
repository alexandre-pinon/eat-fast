import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-poppins)"],
      },
      fontSize: {
        xs: "0.5626rem",
        sm: "0.75rem",
        base: "1rem",
        lg: "1.333rem",
        xl: "1.777rem",
        "2xl": "2.369rem",
        "3xl": "3.157rem",
        "4xl": "4.209rem",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: "#FAFAFA",
            },
            primary: {
              "50": "#FDE2DC",
              "100": "#FDD5D1",
              "200": "#FBA4A3",
              "300": "#F3747F",
              "400": "#E8506D",
              "500": "#DA1C52",
              "600": "#BB1454",
              "700": "#9C0E52",
              "800": "#7E084C",
              "900": "#680548",
              DEFAULT: "#DA1C52",
            },
            success: {
              "50": "#EDFCE0",
              "100": "#E4FBD6",
              "200": "#C4F8AE",
              "300": "#98EA81",
              "400": "#6ED55E",
              "500": "#37BA30",
              "600": "#239F27",
              "700": "#188525",
              "800": "#0F6B21",
              "900": "#095920",
              DEFAULT: "#37BA30",
            },
            secondary: {
              "50": "#D7FDF5",
              "100": "#CAFCF6",
              "200": "#96FAF6",
              "300": "#60ECF1",
              "400": "#39D1E4",
              "500": "#00ACD3",
              "600": "#0086B5",
              "700": "#006497",
              "800": "#00487A",
              "900": "#003465",
              DEFAULT: "#00ACD3",
            },
            warning: {
              "50": "#FEFBD8",
              "100": "#FEF9CC",
              "200": "#FEF399",
              "300": "#FEE966",
              "400": "#FDE040",
              "500": "#FCD202",
              "600": "#D8B001",
              "700": "#B59001",
              "800": "#927200",
              "900": "#785C00",
              DEFAULT: "#FCD202",
            },
            danger: {
              "50": "#FEEBDF",
              "100": "#FEE1D5",
              "200": "#FEBDAC",
              "300": "#FC9083",
              "400": "#FA6763",
              "500": "#F7313E",
              "600": "#D4233F",
              "700": "#B1183E",
              "800": "#8F0F3A",
              "900": "#760937",
              DEFAULT: "#F7313E",
            },
          },
        },
      },
    }),
  ],
};
export default config;
