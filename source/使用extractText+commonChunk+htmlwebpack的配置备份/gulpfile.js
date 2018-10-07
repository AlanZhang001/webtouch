var gulp = require('gulp');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var named = require('vinyl-named-with-path');
var extend = require('extend');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rev = require('futu-gulp-rev');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var exec = require('child_process').exec;
var runSequence = require('run-sequence');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var devConfig = {
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'text'
        }, {
            test: /\.(?:png|jpe?g|gif)(?:\?\s*)?/,
            loader: 'url',
            query: {
                limit: 10000,
                name: '[name]-[hash].[ext]'
            }
        }, {
            test: /\.js$/,
            loader: 'babel',
            exclude: './node_modules/',
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.css$/,
            exclude: './node_modules/',
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test: /\.tpl$/,
            loader: 'text',
        }]
    },
    externals: {
        jquery: 'jQuery',
        zepto: 'Zepto'
    },
    output: {
        publicPath: '/scripts/dist/',
        filename: '[name]-[hash].js',
        // 打包时，依赖包的路径信息将包含在js中
        pathinfo:true,
        chunkFilename:'chunks/[name].chunkfile.[chunkhash].js'
    },
    watch: false,
    plugins: [
        new ExtractTextPlugin('[name]-[contenthash].css', {
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'libjs' // Specify the common bundle's name.
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: './../../site/zhibo.html',
            chunks: ['libjs', 'live\\indexMain'],
            template: './web/tpls/zhibo.tpl'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: './../../site/universityNew.html',
            chunks: ['libjs', 'index\\indexNewMain'],
            template: './web/tpls/universityNew.tpl'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: './../../site/university.html',
            chunks: ['libjs', 'index\\indexMain'],
            template: './web/tpls/university.tpl'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: './../../site/huashan.html',
            chunks: ['libjs', 'teachers\\huashanMain'],
            template: './web/tpls/huashan.tpl'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: './../../site/huashan-disclaimer.html',
            chunks: ['libjs', 'teachers\\huashan-disclaimerMain'],
            template: './web/tpls/huashan-disclaimer.tpl'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: './../../site/huashan-buy.html',
            chunks: ['libjs', 'teachers\\huashan-buyMain'],
            template: './web/tpls/huashan-buy.tpl'
        })
    ],
    devtool: 'source-map',
    resolve:{
        modulesDirectories: ['./web/scripts/','./node_modules'],
        alias:{
            BASE: 'source/lib/BASE',
            DateUtil: 'source/lib/DateUtil',
        }
    }
};

var prodConfig = extend(true, {}, devConfig, {
    output: {
        pathinfo: false
    },
    devtool: '#cheap-module-source-map'
});

prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin('*.js'));

gulp.task('out',function(){
    console.log(prodConfig);
    console.log(devConfig);
});

gulp.task('clean', function() {
    return gulp.src(['./web/scripts/dist'], {
            read: false
        })
        .pipe(clean());
});

//js开发环境
gulp.task('webpackDev', function() {
    return gulp.src('./web/scripts/source/**/*Main.js')
        .pipe(named())
        .pipe(plumber())
        .pipe(gulpWebpack(devConfig))
        .pipe(gulp.dest('./web/scripts/dist'));
});

//js生产环境
gulp.task('webpackProd', function() {
    return gulp.src('./web/scripts/source/**/*Main.js')
        .pipe(named())
        .pipe(gulpWebpack(prodConfig))
        .pipe(gulp.dest('./web/scripts/dist'));
});

//监控文件变化
gulp.task('watch', function() {
    gulp.watch(['./web/scripts/source/**/*Main.js', './web/scripts/source/**/*.html'], ['webpackDev']);
});

gulp.task('default', function() {
    return runSequence('clean', 'webpackDev', 'watch');
});

gulp.task('dev', ['default']);

gulp.task('npm-install', function(cb) {
    exec('npm install', function(err, stdout, stderr) {
        console.log('stdout : ' + stdout);
        console.log('stderr : ' + stderr);
        cb(err);
    });
});

gulp.task('pub', function() {
    return runSequence('clean', 'webpackProd');
});

gulp.task('prod', ['pub']);
