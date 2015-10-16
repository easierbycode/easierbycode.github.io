var gulp = require('gulp');

var tinylr;
gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(8081);
});

gulp.task('express', function() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')({port: 8081}));
    app.use(express.static(__dirname));
    app.listen(8080, '0.0.0.0');
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
    gulp.watch('*.css', notifyLiveReload);
});

gulp.task('default', ['express', 'livereload', 'watch'], function() {

});