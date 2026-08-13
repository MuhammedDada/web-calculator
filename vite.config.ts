/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default test environment is "node" for tests/unit/domain (pure logic, Constitution
// Principle II/III). Component tests under tests/component opt into jsdom individually via a
// `/** @vitest-environment jsdom */` docblock at the top of each file.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
});
