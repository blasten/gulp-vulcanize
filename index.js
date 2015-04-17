'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var vulcanize = require('vulcanize');

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}

		var target = path.relative(opts.abspath, file.path);

		vulcanize.setOptions(opts);

		vulcanize.process(target, function (err, inlinedHtml) {
			if (err) {
				cb(new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
				return;
			}

			file.contents = new Buffer(inlinedHtml);
			cb(null, file);
		}.bind(this));
	});
};
