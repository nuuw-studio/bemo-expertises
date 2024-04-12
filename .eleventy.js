const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { eleventyImageTransformPlugin, Image } = require('@11ty/eleventy-img')
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
    "./static/css/prism-tomorrow.css",
    "./src/static/favicon": "./",
    "./src/static/fonts": "./static/fonts",
    "./src/static/js": "./static/js",
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: 'html',

    // Add any other Image utility options here:

    // optional, output image formats
    formats: ['webp', 'jpeg'],
    // formats: ["auto"],

    // optional, output image widths
    // widths: ["200", "400", "800", "1200", "1600", "2400"],

    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
        loading: 'lazy',
        decoding: 'async',
    },
  });

  eleventyConfig.addShortcode('image', async function (src, alt, sizes) {
      let metadata = await Image(src, {
          widths: [300, 600],
          formats: ['webp', 'jpeg'],
      })

      let imageAttributes = {
          alt,
          sizes,
          loading: 'lazy',
          decoding: 'async',
      }

      // You bet we throw an error on a missing alt (alt="" works okay)
      return Image.generateHTML(metadata, imageAttributes)
  })

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
