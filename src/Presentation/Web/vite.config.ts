import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        visualizer({
            filename: "./dist/stats.html",
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@store": path.resolve(__dirname, "./src/store"),
            "@api": path.resolve(__dirname, "./src/api"),
            "@types": path.resolve(__dirname, "./src/types"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@context": path.resolve(__dirname, "./src/context"),
        },
    },
    build: {
        target: "esnext",
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"],
                    query: ["@tanstack/react-query"],
                    ui: ["@headlessui/react", "@heroicons/react"],
                    forms: ["react-hook-form", "@hookform/resolvers", "zod"],
                    i18n: [
                        "i18next",
                        "react-i18next",
                        "i18next-browser-languagedetector",
                    ],
                },
            },
        },
        reportCompressedSize: true,
    },
    optimizeDeps: {
        include: [
            "react",
            "react-dom",
            "@reduxjs/toolkit",
            "@tanstack/react-query",
        ],
    },
});
