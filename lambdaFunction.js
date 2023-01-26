const aws = require('aws-sdk');
const s3 = new aws.S3();
const fetch = require('node-fetch');

const parkingDecks = [
	{ 'key': 'RANKINFacility', 'name': 'Rankin Ave', 'coords': [35.596133, -82.554072] },
	{ 'key': 'CIVICFacility', 'name': 'Civic Center', 'coords': [35.596867, -82.554126] },
	{ 'key': 'WALLFacility', 'name': 'Wall Street', 'coords': [35.594614, -82.557025] },
	{ 'key': 'BILTMOREFacility', 'name': 'Biltmore Ave', 'coords': [35.592445, -82.551773] }
];

async function getParkingLogix() {
	try {
		fetch(process.env.logix_url, {
			method: 'GET',
			headers: {
				'x-api-key': process.env.logix_apikey
			},
		})
			.then(res => res.json())
			.then(logix_data => {
				resolve(logix_data)
			})
	} catch (err) {
		reject(err)
	}

}

exports.handler = async (event, context, callback) => {
	try {
		let logix = await getParkingLogix();
		console.log(logix);
		// let spaces = { 'decks': [] };

		// for (let i = 0; i < parkingDecks.length; i++) {
		// 	spaces.decks[i] = {
		// 		'name': parkingDecks[i].name,
		// 		'available': array[array.indexOf(parkingDecks[i].key) + 3],
		// 		'coords': parkingDecks[i].coords
		// 	}
		// };

		// const payload = {
		// 	Body: JSON.stringify(spaces),
		// 	Bucket: 'asheville-parking-decks',
		// 	Key: 'spaces.json'
		// };

		// s3.putObject(payload, function (err, data) {
		// 	if (err) throw err;
		// 	console.log("putObject success!");
		// });
	} catch (error) {
		console.log(err);
	}
};