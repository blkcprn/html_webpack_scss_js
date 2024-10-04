const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


class Paths {
    src = "src";
    dist = "dist";
    images = "images";
    fonts = "fonts";
    files = "files";
    js = "js";
    css = "styles";
    html = "html";
    entry = "index.js";
    public = "/";
    
    constructor(isDevMode) {
        this.isDev = isDevMode;
    }
    get srcDir() {
        return path.resolve(__dirname, this.src);
    }
    get distDir() {
        return path.resolve(__dirname, this.dist);
    }
    get entryJs() {
        return path.resolve(__dirname, this.src, this.entry);
    }
    get assets() {
        return path.join(this.images, this.isDev ? "[name][ext]" : "[name].[contenthash][ext]");
    }
    get public() {
        return this.public;
    }
    get tmplPath() {
        return `${this.src}/${this.html}`;
    }
    get outfileJs() {
        return  `${this.js}/${this.getFileName("js")}`;
    }
    get outfileCss() {
        return  `${this.css}/${this.getFileName("css")}`;
    }
    get outfileFonts() {
        return `${this.fonts}/[name][ext]`;
    }
    get outfileFiles() {
        return `${this.files}/[name][ext]`;
    }
    getFileName(ext) {
        return this.isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
    }
}


function getHtmlPages(isProdMode, tmplPath, names) {
    let pages = [];
    names.forEach(pageName => {
        pages.push(
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, tmplPath, pageName),
                filename: pageName,
                minify: {
                    collapseWhitespace: isProdMode
                }
            }),
        );
    });
    return pages;
}


module.exports = { Paths, getHtmlPages }