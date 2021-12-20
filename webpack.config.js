const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports ={
    context: path.resolve(__dirname, "src"),
    entry: "./dist/js/index.js",
    module:{
        rules: [
            {
                test:/\.s[ac]ss$/i,
                use:[
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader',
                options: {
                    name: './assets/files/[name].[ext]'
                }
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: "./assets/js/index.[contenthash].bundle.js"
    },
    resolve: {
        extensions: ['.js', '.scss', '.json', '.css', '.mp3'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@style': path.resolve(__dirname, 'src', 'dist', 'css'),
            '@app': path.resolve(__dirname, 'src', 'dist', 'js'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        }
    },
    devServer: {
        port: 3000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Calculator Andersen",
            template: './index.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "/assets/css/[name].css",
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src', 'assets', 'favicon.ico'), to: path.resolve(__dirname, 'public', 'favicon.ico') },
            ],
        }),
    ]
}