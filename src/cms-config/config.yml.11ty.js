const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const deepmerge = require("deepmerge");

// Load YAML helper
function loadYAML(filePath) {
  return yaml.load(fs.readFileSync(filePath, "utf-8"));
}

// Array merging strategy (Decap wants concatenation)
const mergeOptions = {
  arrayMerge: (target, source) => [...target, ...source],
};

/**
 * Inject partials and block types inside collections
 */
function injectPartials(obj, partials, blocks) {
  if (Array.isArray(obj)) {
    return obj.flatMap((item) => injectPartials(item, partials, blocks));
  }

  if (typeof obj === "object" && obj !== null) {
    // Inject field partials: { partial: "seo" }
    if (obj.partial) {
      const key = obj.partial;
      if (!partials[key]) {
        throw new Error(`Partial "${key}" not found in cms-config/partials/`);
      }
      return partials[key];
    }

    // Inject block types: { block: "paragraph" }
    if (obj.block) {
      const key = obj.block;
      if (!blocks[key]) {
        throw new Error(
          `Block type "${key}" not found in cms-config/partials/blocks/`
        );
      }
      return blocks[key];
    }

    // Recurse normally
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = injectPartials(value, partials, blocks);
    }
    return newObj;
  }

  return obj;
}

module.exports = () => {
  const baseDir = __dirname;

  /* ------------------------------
     1. Load root-level config
  ------------------------------ */

  const rootFiles = ["backend.yml", "auth.yml", "ui.yml", "local.yml"]
    .map((filename) => path.join(baseDir, filename))
    .filter((file) => fs.existsSync(file));

  const rootConfig = rootFiles.reduce((acc, file) => {
    return deepmerge(acc, loadYAML(file), mergeOptions);
  }, {});

  /* ------------------------------
     2. Load field partials
  ------------------------------ */
  const partialsDir = path.join(baseDir, "partials", "fields");
  const partials = {};

  if (fs.existsSync(partialsDir)) {
    fs.readdirSync(partialsDir)
      .filter((file) => file.endsWith(".yml"))
      .forEach((file) => {
        const key = path.basename(file, ".yml");
        const data = loadYAML(path.join(partialsDir, file));
        partials[key] = Object.values(data)[0]; // expect { seo: [...] }
      });
  }

  /* ------------------------------
     3. Load block type partials
  ------------------------------ */
  const blocksDir = path.join(baseDir, "partials", "blocks");
  const blocks = {};

  if (fs.existsSync(blocksDir)) {
    fs.readdirSync(blocksDir)
      .filter((file) => file.endsWith(".yml"))
      .forEach((file) => {
        const key = path.basename(file, ".yml");
        const data = loadYAML(path.join(blocksDir, file));
        blocks[key] = Object.values(data)[0]; // expect { paragraph: {...} }
      });
  }

  /* ------------------------------
     4. Load collections
  ------------------------------ */
  const collectionsDir = path.join(baseDir, "collections");
  let collections = [];

  if (fs.existsSync(collectionsDir)) {
    fs.readdirSync(collectionsDir)
      .filter((file) => file.endsWith(".yml"))
      .forEach((file) => {
        const col = loadYAML(path.join(collectionsDir, file));
        collections.push(col);
      });
  }

  /* ------------------------------
     5. Combine + inject partials & blocks
  ------------------------------ */
  let finalConfig = deepmerge(rootConfig, {}, mergeOptions);

  if (collections.length > 0) {
    finalConfig = deepmerge(
      finalConfig,
      { collections: collections.flatMap((c) => c.collections) },
      mergeOptions
    );

    finalConfig.collections = finalConfig.collections.map((col) =>
      injectPartials(col, partials, blocks)
    );
  }

  return yaml.dump(finalConfig);
};

module.exports.data = {
  permalink: "admin/config.yml",
};
