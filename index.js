const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fetch = require("node-fetch");
const getSecrets = require("./getSecrets.js");

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import fetch from 'node-fetch';
// import getSecrets from "./getSecrets.js";

const s3_client = new S3Client({ region: "us-east-1" });

async function getParkingLogix(secrets) {
	try {
		return fetch(secrets.logix_url, {
			method: 'GET',
			headers: {
				'x-api-key': secrets.logix_apikey,
			},
		})
			.then(res => res.json())
				.then(logix_data => {
					return(logix_data);
				})
	} catch (err) {
		throw (err);
	}
}

async function sendToS3(strResult) {
	try {
		let uploadParams = {
			Bucket: "avl-parking-decks",
			Key: "spaces.json",
			Body: strResult,
		};

		const command = new PutObjectCommand(uploadParams)
		const response = await s3_client.send(command)
		console.log("S3 response:", response.$metadata.httpStatusCode)
	}
	catch (err) {
		console.log("S3 Err: ", err)
	}
}

exports.handler = async (event, context, callback) => {
// (async function x() {
	try {
		const secrets = await getSecrets("parking_logix");
		let logix = await getParkingLogix(secrets);

		let spaces = { 'decks': [] };
		let parkingDecks = logix[0];

		for (let i = 0; i < parkingDecks.length; i++) {
			spaces.decks[i] = {
				'name': parkingDecks[i].location_name,
				'available': parkingDecks[i].free_spaces,
				'coords': JSON.parse('[' + parkingDecks[i].geocode.slice(1, -1) + ']')
			}
		};

		await sendToS3(JSON.stringify(spaces));
	} catch (error) {
		console.log(error);
	}
// })();
};