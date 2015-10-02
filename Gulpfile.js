var gulp = require('gulp');

var tinylr;
gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(4002);
});

gulp.task('express', function() {
    var express = require('express');
    var app = express();
    // app.use(require('connect-livereload')({port: 4002}));
    app.use(express.static(__dirname));
    app.listen(process.env.PORT, '0.0.0.0');
});

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('watch', function() {
    gulp.watch('*.html', notifyLiveReload);
    gulp.watch('css/*.css', notifyLiveReload);
});

gulp.task('default', ['express'], function() {

});