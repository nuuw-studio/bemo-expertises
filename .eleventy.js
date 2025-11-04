const yaml = require('js-yaml')
const { DateTime } = require('luxon')
const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img')
const htmlmin = require('html-minifier')

module.exports = function (eleventyConfig) {
    // Disable automatic use of your .gitignore
    eleventyConfig.setUseGitIgnore(false)

    // Merge data instead of overriding
    eleventyConfig.setDataDeepMerge(true)

    // human readable date
    eleventyConfig.addFilter('readableDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
            'dd LLL yyyy'
        )
    })

    // To Support .yaml Extension in _data
    // You may remove this if you can use JSON
    eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents))

    // Copy Static Files to /_Site
    eleventyConfig.addPassthroughCopy({
        './src/admin/config.yml': './admin/config.yml',
        './node_modules/alpinejs/dist/cdn.min.js': './static/js/alpine.js',
        './src/static/favicon': './',
        './src/static/fonts': './static/fonts',
        './src/static/js': './static/js',
    })

    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        // which file extensions to process
        extensions: 'html',
        formats: ['webp', 'jpeg'],
        widths: ['400', '800', '1200'],

        // optional, attributes assigned on <img> override these values.
        defaultAttributes: {
            sizes: '30vw',
            loading: 'lazy',
            decoding: 'async',
        },
    })

    // Minify HTML
    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
        // Eleventy 1.0+: use this.inputPath and this.outputPath instead
        if (outputPath.endsWith('.html')) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            })
            return minified
        }

        return content
    })

    // Let Eleventy transform HTML files as nunjucks
    // So that we can use .html instead of .njk
    return {
        dir: {
            input: 'src',
        },
        htmlTemplateEngine: 'njk',
    }
}
