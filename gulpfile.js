const  gulp = require('gulp')
const nodemon = require('gulp-nodemon')


gulp.task('default',() => {
    nodemon({
        script : "src/index.js",
        ignore : ['node_modules']
    })
})