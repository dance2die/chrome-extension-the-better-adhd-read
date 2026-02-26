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
      "./src/options/options.tsx",
    ],
    outdir: "./dist",
    naming: "[dir]/[name].[ext]",
  });

  console.log("✅ Scripts bundled.");

  // 2. Copy static assets
  const assets = [
    { from: "src/manifest.json", to: "dist/manifest.json" },
    { from: "src/popup/index.html", to: "dist/popup/index.html" },
    { from: "src/options/options.html", to: "dist/options/options.html" },
  ];

  for (const asset of assets) {
    if (asset.from.includes('options/')) {
      await mkdir("dist/options", { recursive: true });
    }
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

  // 4. Copy options CSS
  await mkdir("dist/options", { recursive: true });
  await copyFile("src/options/options.css", "dist/options/options.css");
  console.log("✅ Copied options.css");

  // 5. Copy icons
  await mkdir("dist/icons", { recursive: true });
  const iconFiles = await readdir("src/icons");
  for (const file of iconFiles) {
    if (file.endsWith(".png")) {
      await copyFile(join("src/icons", file), join("dist/icons", file));
      console.log(`✅ Copied src/icons/${file} to dist/icons/${file}`);
    }
  }

  console.log("✨ Build complete!");
}

runBuild().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
