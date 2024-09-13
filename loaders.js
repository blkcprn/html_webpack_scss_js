const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const html_loader = {
    test: /\.html$/i,
    loader: 'html-loader',
}
const scss_loader = (isDevMode) => {
    return {
        test: /\.(scss|css|sass)$/,
        use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader, 
            'css-loader',
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: [
                            [
                                "postcss-preset-env",
                                {
                                    // Options
                                },
                            ],
                        ],
                    },
                },
            },
            'sass-loader',
        ],
    }
}
const fonts_loader = (filenameFonts) => {
    return {
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
            filename: filenameFonts
        }
    }
}
const files_loader = (filenameFiles) => {
    return {
        test: /\.(pdf|doc|docx)$/i,
        type: 'asset/resource',
        generator: {
            filename: filenameFiles
        }
    }
}
const images_loader = {
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
        {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    progressive: true,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                    enabled: false,
                },
                pngquant: {
                    quality: [0.65, 0.90],
                    speed: 4
                },
                gifsicle: {
                    interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                    quality: 75
                }
            }
        },
    ],
}
const babel_loader = {
    test: /\.(?:js|mjs|cjs)$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                ['@babel/preset-env', { targets: "defaults" }]
            ]
        }
    }
}


module.exports = {
    html_loader,
    scss_loader,
    fonts_loader,
    files_loader,
    images_loader,
    babel_loader,
}