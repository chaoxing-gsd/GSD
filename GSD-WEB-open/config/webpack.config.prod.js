
var webpack               = require('webpack');
var HtmlWebpackPlugin     = require('html-webpack-plugin');
var ExtractTextPlugin     = require('extract-text-webpack-plugin');
var ManifestPlugin        = require('webpack-manifest-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var url                   = require('url');
var paths                 = require('./paths');
var path                  = require('path');

function ensureSlash(path, needsSlash) {
    var hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return path + '/';
    } else {
        return path;
    }
}

var homepagePath = require(paths.appPackageJson).homepage;
var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
var publicPath = ensureSlash(homepagePathname, true);
var publicUrl = ensureSlash(homepagePathname, false);

if (process.env.NODE_ENV !== "production") {
    throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = {
    // Don't attempt to continue if there are any errors.
    bail: true,
    devtool: 'source-map',
    entry:{
        app:paths.appIndexJs,
        vendor:[
            'babel-polyfill',
            'react',
            'react-dom',
            'react-router',
            'react-router-redux',
            'sweetalert2',
            "redux",
            "isomorphic-fetch",
            "fetch-jsonp"
        ]

    },
    output: {
        // The build folder.
        path: paths.appBuild,
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: publicPath
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', ''],
        alias: {
            'react-native': 'react-native-web'
        }
    },
    resolveLoader: {
        root: paths.ownNodeModules,
        moduleTemplates: ['*-loader']
    },
    externals: {

    },
    // @remove-on-eject-end
    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint',
                include: paths.appSrc
            }
        ],
        loaders: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.json$/,
                    /\.svg$/
                ],
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            },
            // Process JS with Babel.
            {
                test: /\.(js|jsx)$/,
                include: paths.appSrc,
                loader: 'babel',
                // @remove-on-eject-begin
                query: {
                    babelrc: false,
                    presets: [require.resolve('babel-preset-react-app')],
                    plugins: ['transform-runtime',['import', [{ libraryName: 'antd', style: "css" },{
                        "libraryName": "@material-ui/core",
                        "libraryDirectory": "components",  // default: lib
                        "camel2DashComponentName": false,  // default: true
                    }]]],

                },
                // @remove-on-eject-end
            },
            {
                test: /\.css$/,
                loaders: ["style", "css"],
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file',
                query: {
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            }
        ]
    },
    eslint: {
        // TODO: consider separate config for production,
        configFile: path.join(__dirname, '../.eslintrc'),
        useEslintrc: false
    },

    plugins: [

        new InterpolateHtmlPlugin({
            PUBLIC_URL: publicUrl
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'production'
            )
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor"],
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true, // React doesn't support IE8
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),
        new ManifestPlugin({
            fileName: 'asset-manifest.json'
        }),
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
