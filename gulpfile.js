const  gulp = require('gulp')
const nodemon = require('gulp-nodemon')


gulp.task('default',() => {
    var stream =  nodemon({
        script : "src/index.js",
        ignore : ['node_modules']
    })
    stream.on('restart',() => console.log(`restarted`))
    stream.on('crash',() => console.log(`crashed`))
})