const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { 
    Paths, 
    getHtmlPages,
} = require('./helpers');
const { 
    html_loader,
    scss_loader,
    fonts_loader,
    files_loader,
    images_loader,
    babel_loader,
} = require('./loaders');


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
    paths = new Paths(isDev);

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
                html_loader,
                scss_loader(isDev),
                fonts_loader(paths.outfileFonts),
                files_loader(paths.outfileFiles),
                images_loader,
                babel_loader,
            ]
        },
        plugins: [
            ...getHtmlPages(isProd, paths.tmplPath, pageNames),
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