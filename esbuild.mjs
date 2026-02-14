import { context, build } from "esbuild";
import { cpSync, rmSync, globSync, watch as fsWatch } from "fs";

const watching = process.argv.includes("--watch");

const SRC = "src";
const OUT = "build";

// Find all .ts files under src/ that aren't in lib/ (those are imported, not entry points)
const entryPoints = globSync(`${SRC}/**/!(*lib*)/*.ts`);

const options = {
  entryPoints,
  bundle: true,
  outdir: OUT,
  outbase: SRC,
  format: "iife",
  target: "es2020",
  logLevel: "info",
};

function copyStatic() {
  cpSync(SRC, OUT, {
    recursive: true,
    filter: (src) => !src.endsWith(".ts"),
  });
}

rmSync(OUT, { recursive: true, force: true });

if (watching) {
  const ctx = await context(options);
  await ctx.watch();
  copyStatic();

  fsWatch(SRC, { recursive: true }, (_, filename) => {
    if (filename && !filename.endsWith(".ts")) {
      copyStatic();
    }
  });

  console.log("Watching for changes...");
} else {
  await build(options);
  copyStatic();
}
