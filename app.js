var aws = require('aws-sdk'),
http = require('http'),
fs = require('fs'),
path = require('path');

//You need to specify your S3 credentials in an auth.json file located in the root of this directory
//This needs to be in gitignore!!!! or better yet an environmental variable
//var config_path = path.join('auth.json');

//pass you credentials to aws
aws.config.loadFromPath('C:\\NodeJobs\\parking-parser\\auth.json');

//instantiate a new s3 object to work with
var s3 = new aws.S3();

//Get the source data
var path = "//coa-parking-app1/Count/webcount.dat";

var parkingDecks = [
	{'key' : 'RANKINFacility', 'name' : 'Rankin Ave', 'coords' :[35.596133, -82.554072]}, 
	{'key' : 'CIVICFacility', 'name' : 'Civic Center', 'coords' : [35.596867, -82.554126]}, 
	{'key' : 'WALLFacility', 'name' : 'Wall Street', 'coords' : [35.594614, -82.557025]}, 
	{'key' : 'BILTMOREFacility', 'name' : 'Biltmore Ave', 'coords' : [35.592445, -82.551773]}
	];
var spaces = {'decks' : []};
var processFileAndUploadItToS3 = function(){
	fs.readFile(path, function(err, f){
	    var textString = f.toString().replace(/[\r\n]+/g, '').replace(/\s{1,10}/g, ' ');;
	    var array = textString.split(' ');
	   
	    for (var i = 0; i < parkingDecks.length; i++) {
	      spaces.decks[i] = {
	      	'name' : parkingDecks[i].name,  
	      	'available' : array[array.indexOf(parkingDecks[i].key) + 3], 
	      	'coords' : parkingDecks[i].coords}
	    };

	    var payload = {
		    Body: JSON.stringify(spaces),
		    Bucket: 'asheville-parking-decks',
		    Key: 'spaces.json'
		  };

		 s3.putObject(payload, function (err, data) {
		 	if(err) throw err;
		    console.log("It made it to S3 at yay!");
		  });


	});
}


//Recursively make http requests at the interval of appConfig.interval
var recursiveSetTimeout = function(){
  processFileAndUploadItToS3();
  setTimeout(recursiveSetTimeout, 30000);
}

//This starts everything 
recursiveSetTimeout();

