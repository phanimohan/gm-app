var gm = require('gm');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var path = require('path');
var async = require('async');
var config = require('./config/app-config.json');
var source = require('./source.json');
var filesDir = './files/';
var fontFile = 'fonts/SourceSansPro/TTF/SourceSansPro-Semibold.ttf';
var titleColor = '#FFFFFF';
var descColor = '#CCCCCC';

_.each(config['types'], function(element, key, array){
	var typeDir = filesDir + key;
	mkdirp(typeDir, function (err) {
	    if (err) console.error(err)
	});

	_.each(element, function(e, k, a){
		var resDir = typeDir + '/' + k;
		mkdirp(resDir, function (err) {
		    if (err) console.error(err)
		});

	    _.each(source, function(sElement, sKey, sArray){
	    	var imgName = path.parse(sElement['image']).name;
	    	var ext = path.extname(sElement['image']).split('?');

	    	var imgToSave = resDir + '/' + imgName + ext['0'];
	    	var boxYPosition = 65;

		    gm(sElement['image'])
				.resize(e['width'], e['height'])
				.autoOrient()
				.quality(100)
				.write(imgToSave, function (err) {
				  	if (err) console.log( 'error: ' + err);
				  	if (!err){
		          		// obtain the size of an image to append text.
						gm(imgToSave)
						.size(function (err, size) {
						  	if (!err) {
						    	boxYPosition = size.height - boxYPosition;

						    	// Append text to generated image.
						    	gm(imgToSave)
						    		.quality(100)
									.matte()
									.fill('rgba(0, 0, 0, 65)')
									.drawRectangle(0, boxYPosition, e['width'], e['height'])
									.font(fontFile)
									.gravity('SouthWest')
									.fill(titleColor)
									.fontSize(16)
									.drawText(10, 45, sElement['title'])
									.fill(descColor)
									.fontSize(14)
									.drawText(10, 25, sElement['description'])
									.write(imgToSave, function (err) {
									  if (err) console.log( 'error: ' + err);
									});
						  	}
						});
		          	}
				});
	    });
	});
});

console.log('Completed--->');
