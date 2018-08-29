const aws = require('aws-sdk');
const s3 = new aws.S3();

const params = {
    Bucket: process.env.PRIVATE_BUCKET,
    Key: 'webcount-raw.dat',
}

const parkingDecks = [
	{'key' : 'RANKINFacility', 'name' : 'Rankin Ave', 'coords' :[35.596133, -82.554072]}, 
	{'key' : 'CIVICFacility', 'name' : 'Civic Center', 'coords' : [35.596867, -82.554126]}, 
	{'key' : 'WALLFacility', 'name' : 'Wall Street', 'coords' : [35.594614, -82.557025]}, 
	{'key' : 'BILTMOREFacility', 'name' : 'Biltmore Ave', 'coords' : [35.592445, -82.551773]}
	];
	
exports.handler = (event, context, callback) => {
    s3.getObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            let spaces = {'decks' : []};
            const textString = data.Body.toString().replace(/[\r\n]+/g, '').replace(/\s{1,10}/g, ' ');
            const array = textString.split(' ');
            for (let i = 0; i < parkingDecks.length; i++) {
    	        spaces.decks[i] = {
    	      	    'name' : parkingDecks[i].name,  
    	      	    'available' : array[array.indexOf(parkingDecks[i].key) + 3], 
    	      	    'coords' : parkingDecks[i].coords}
    	    };
    
    	    const payload = {
    		    Body: JSON.stringify(spaces),
    		    Bucket: 'asheville-parking-decks',
    		    Key: 'spaces.json'
    		  };
    
    		 s3.putObject(payload, function (err, data) {
    		 	if(err) throw err;
    		    console.log("putObject success!");
    		  });
            }
    })
};