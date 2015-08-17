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

var processImage = function (imgResConfig, resType, sElement, sKey, resDir, callback) {
	var imgName = path.parse(sElement['image']).name;
	var ext = path.extname(sElement['image']).split('?');

	var imgQuality = (imgResConfig['quality']) ? imgResConfig['quality'] : config['quality'][resType];

	var imgToSave = resDir + '/' + imgName + ext['0'];
	var boxYPosition = 65;

    gm(sElement['image'])
		.resize(imgResConfig['width'], imgResConfig['height'])
		.autoOrient()
		.quality(imgQuality)
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
				    		.quality(imgQuality)
							.matte()
							.fill('rgba(0, 0, 0, 65)')
							.drawRectangle(0, boxYPosition, imgResConfig['width'], imgResConfig['height'])
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
							  callback();
							});
				  	}
				});
          	}
		});
};

var processResolution = function (imgResConfig, resType, typeDir, callback) {
	var resDir = typeDir + '/' + resType;
	mkdirp(resDir, function (err) {
	    if (err) console.error(err)
	});

	async.forEachOf(source, 
		function(sElement, sKey, callback) {
			processImage(imgResConfig, resType, sElement, sKey, resDir, callback);
		}, 
		function(err){
	      callback();
	});
};

var processConfigItem = function (type, key, callback) {
	var typeDir = filesDir + key;
	mkdirp(typeDir, function (err) {
	    if (err) console.error(err)
	});

	async.forEachOf(type, 
		function(imgResConfig, resType, callback) {
			processResolution(imgResConfig, resType, typeDir, callback);
		}, 
		function(err){
	      console.log('Images generated for ' + key);
	      callback();
	});
};

async.forEachOf(config['types'], 
	function(type, key, callback) {
		processConfigItem(type, key, callback);
	}, 
	function(err){
      doSomethingOnceAllAreDone();
});

function doSomethingOnceAllAreDone() {
    console.log("Everything is done.");
}
