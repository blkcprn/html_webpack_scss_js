const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const helper = require('./helpers');
const loader = require('./loaders');


const pageNames = [
    'index.html',
    'about.html',
];


const server = {
    port: 3000,
    open: false,
    hot: true,
}


module.exports = (env) => {
    isDev = env.mode === 'development';
    isProd = !isDev;
    targer = isDev ? 'web' : 'browserslist';
    devtool = isProd ? false : 'source-map';
    paths = new helper.Paths(isDev);

    return {
        mode: env.mode,
        entry: {
            main: paths.entryJs,
        },
        output: {
            path: paths.distDir,
            filename: paths.outfileJs,
            assetModuleFilename: paths.assets,
            publicPath: paths.public,
            clean: true
        },
        devServer: {
            watchFiles: paths.dist,
            port: server.port,
            open: server.open,
            hot: server.hot,
        },
        devtool: devtool,
        module: {
            rules: [
                loader.html_loader,
                loader.scss_loader(isDev),
                loader.fonts_loader(paths.outfileFonts),
                loader.files_loader(paths.outfileFiles),
                loader.images_loader,
                loader.babel_loader,
            ]
        },
        plugins: [
            ...helper.getHtmlPages(isProd, paths.tmplPath, pageNames),
            new MiniCssExtractPlugin({
                filename: paths.outfileCss,
            }),
        ],
        optimization: {
            minimizer: [
                new CssMinimizerPlugin(),
            ],
        }
    }
}