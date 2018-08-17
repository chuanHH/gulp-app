var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),        //图片压缩
    minifycss = require('gulp-minify-css'),    //css压缩
    // jshint = require('gulp-jshint'),       //js检查
    babel = require("gulp-babel"),           //es6
    uglify = require('gulp-uglify'),        //js压缩
    rename = require('gulp-rename'),      //重命名
    concat = require('gulp-concat'),       //合并文件
    clean = require('gulp-clean'),        //清空文件夹
    htmlmin = require('gulp-htmlmin'),       //html 处理
    less = require('gulp-less'),           // less
    connect = require('gulp-connect')//webserver
//css 压缩
gulp.task('minifycss',function() {
    var cssSrc = './src/css/*.css',
        cssDst = './dist/css';
    return gulp.src(cssSrc)                  //被压缩的文件
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())                       //执行压缩
        .pipe(gulp.dest(cssDst))  //输出文件夹
        .pipe(connect.reload());
});
gulp.task('testLess', function () {
    var cssSrc = './src/css/*.less',
        cssDst = './dist/css';
    return gulp.src(cssSrc)                  //被压缩的文件
        .pipe(rename({ suffix: '.min' }))
        .pipe(less())
        .pipe(minifycss())                       //执行压缩
        .pipe(gulp.dest(cssDst))  //输出文件夹
        .pipe(connect.reload());
  });
// 图片处理
gulp.task('imagemin',function(){
    var imgSrc = './src/images/*',
        imgDst = './dist/images';
    return gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(connect.reload());
});
// js处理
gulp.task('uglify',function () {
    var jsSrc = './src/js/*.js',
        jsDst ='./dist/js';
    return gulp.src(jsSrc)
        /*.pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))*/
        // .pipe(concat('main.js'))
        // .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(jsDst))
        .pipe(connect.reload());
});
//html 处理
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    var htmlSrc = './src/*.html',
        htmlDst = './dist';
    gulp.src(htmlSrc)
        .pipe(htmlmin(options))
        .pipe(gulp.dest(htmlDst))//同名的html,会直接替换
        .pipe(connect.reload());
});
// clean被执行时,先清空对应目录下图片、样式、js
gulp.task('clean',function() {
    return gulp.src(['./dist/css', './dist/js', './dist/images'], {read: false})
        .pipe(clean());
});
//把jquery打包到dist/js里面
gulp.task('buildDist', function() {
    gulp.src('./bower_components/jquery/dist/jquery.min.js')
     .pipe(gulp.dest('./dist/js'));
    gulp.src('./src/js/flexible.js')
     .pipe(gulp.dest('./dist/js'));
});
//建立一个配置对象变量，后面我们要传递给插件用来启动server
var serverConfig={
    root:'dist',//从哪个目录开启server
    port:8010,//将服务开启在哪个端口
    livereload: true
  }
  //建立一个server任务 直接可以用 gulp server就可以执行这个任务
  gulp.task('webserver', function() {
    connect.server(serverConfig);
  });  
//watch
// gulp.watch('./src/css/*.css', ['minifycss']);
gulp.task('watch',function(){
    //css
    gulp.watch('./src/css/*.css', ['minifycss']);
    // less
    gulp.watch('./src/css/*.less', ['testLess']);
    //js
    gulp.watch('./src/js/*.js', ['uglify']);
    //image
    gulp.watch('./src/images/*', ['imagemin']);
    //html
    gulp.watch('./src/*.html', ['htmlmin']);
});
// 默认预设任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'],function(){
    gulp.start('webserver', 'minifycss','testLess','uglify','buildDist','imagemin','htmlmin','watch');
});
