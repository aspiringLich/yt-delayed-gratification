import { build } from "esbuild";
import { cpSync } from "fs";
import { rmSync } from "fs";

rmSync("build", { recursive: true, force: true });

await build({
  entryPoints: [
    "src/content/content.ts",
    "src/background/background.ts",
    "src/popup/popup.ts",
    "src/options/options.ts",
  ],
  bundle: true,
  outdir: "build",
  outbase: "src",
  format: "iife",
  target: "es2020",
});

// Copy static assets into build/
cpSync("src/manifest.json", "build/manifest.json");
cpSync("src/styles.css", "build/styles.css");
cpSync("src/popup/popup.html", "build/popup/popup.html");
cpSync("src/popup/popup.css", "build/popup/popup.css");
cpSync("src/options/options.html", "build/options/options.html");
cpSync("src/options/options.css", "build/options/options.css");
cpSync("src/icons", "build/icons", { recursive: true });
