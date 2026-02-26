import { build } from "bun";
import { mkdir, copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";

async function runBuild() {
  console.log("🚀 Starting build...");

  // 1. Bundle TypeScript files
  await build({
    entrypoints: [
      "./src/background/index.ts",
      "./src/content/index.ts",
      "./src/popup/index.tsx",
    ],
    outdir: "./dist",
    naming: "[dir]/[name].[ext]",
  });

  console.log("✅ Scripts bundled.");

  // 2. Copy static assets
  const assets = [
    { from: "src/manifest.json", to: "dist/manifest.json" },
    { from: "src/popup/index.html", to: "dist/popup/index.html" },
  ];

  for (const asset of assets) {
    await copyFile(asset.from, asset.to);
    console.log(`✅ Copied ${asset.from} to ${asset.to}`);
  }

  // 3. Copy CSS files
  await mkdir("dist/styles", { recursive: true });
  const cssFiles = await readdir("src/styles");
  for (const file of cssFiles) {
    if (file.endsWith(".css")) {
      await copyFile(join("src/styles", file), join("dist/styles", file));
      console.log(`✅ Copied src/styles/${file} to dist/styles/${file}`);
    }
  }

  console.log("✨ Build complete!");
}

runBuild().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
