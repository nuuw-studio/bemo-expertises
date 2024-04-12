const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: 'class',
    content: [
        './**/*.html',
        './**/*.njk',
        './**/*.md',
        './**/*.scss',
        'node_modules/preline/dist/*.js',
    ],
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                darkblue: '#1f5173',
                green: '#7be495',
                bluegreen: '#309d9c',
                offwhite: '#d1e8ce',
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },
            fontFamily: {
                body: [
                    [
                        'Outfit',
                        'ui-sans-serif',
                        'system-ui',
                        '-apple-system',
                        'system-ui',
                        'Segoe UI',
                        'Roboto',
                        'Helvetica Neue',
                        'Arial',
                        'Noto Sans',
                        'sans-serif',
                        'Apple Color Emoji',
                        'Segoe UI Emoji',
                        'Segoe UI Symbol',
                        'Noto Color Emoji',
                    ],
                    {
                        fontFeatureSettings:
                            '"dlig" 1, "liga" 1, "salt" 1, "tnum" 0',
                    },
                ],
                sans: [
                    [
                        'Outfit',
                        'ui-sans-serif',
                        'system-ui',
                        '-apple-system',
                        'system-ui',
                        'Segoe UI',
                        'Roboto',
                        'Helvetica Neue',
                        'Arial',
                        'Noto Sans',
                        'sans-serif',
                        'Apple Color Emoji',
                        'Segoe UI Emoji',
                        'Segoe UI Symbol',
                        'Noto Color Emoji',
                    ],
                    {
                        fontFeatureSettings:
                            '"dlig" 1, "liga" 1, "salt" 1, "tnum" 0',
                    },
                ],
                serif: [
                    [
                        'Bespoke',
                        'ui-serif',
                        'system-ui',
                        '-apple-system',
                        'system-ui',
                        'Segoe UI',
                        'Roboto',
                        'Helvetica Neue',
                        'Arial',
                        'Noto',
                        'serif',
                        'Apple Color Emoji',
                        'Segoe UI Emoji',
                        'Segoe UI Symbol',
                        'Noto Color Emoji',
                    ],
                    {
                        fontFeatureSettings:
                            '"dlig" 1, "liga" 1, "salt" 1, "tnum" 0',
                    },
                ],
            },
        },
    },
    variants: {},
    plugins: [require('@tailwindcss/typography'), require('preline/plugin')],
}
