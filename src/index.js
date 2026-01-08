import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';
import getSecrets from './getSecrets.js';

const s3_client = new S3Client({ region: 'us-east-1' });

async function getParkingLogix(secrets) {
  try {
    return fetch(secrets.logix_url, {
      method: 'GET',
      headers: {
        'x-api-key': secrets.logix_apikey,
      },
    })
      .then((res) => res.json())
      .then((logix_data) => {
        return logix_data;
      });
  } catch (err) {
    throw err;
  }
}

async function getCountyDecks() {
  let county_garage_data = [];

  const [collegeJSON, coxeJSON] = await Promise.all([
    fetch('https://s3.amazonaws.com/bc-parking-decks/164College').then((res) => res.json()),
    fetch('https://s3.amazonaws.com/bc-parking-decks/40Coxe').then((res) => res.json()),
  ]);

  const college_spaces = collegeJSON?.decks?.[0]?.available ?? 'NA';
  const coxe_spaces = coxeJSON?.decks?.[0]?.available ?? 'NA';

  county_garage_data.push({
    name: 'College Street',
    slug: 'college-street',
    address: '164 College St, Asheville, NC 28801',
    coords: [35.597220568749506, -82.54918944554281],
    available: college_spaces,
    url: 'https://www.buncombenc.gov/673/Public-Parking',
    jurisdiction: 'county',
  });

  county_garage_data.push({
    name: 'Coxe/Sears Alley',
    slug: 'sears-alley',
    address: '11 Sears Alley, Asheville, NC 28801',
    coords: [35.59364815599471, -82.55473928784323],
    available: coxe_spaces,
    url: 'https://www.buncombenc.gov/673/Public-Parking',
    jurisdiction: 'county',
  });

  return county_garage_data;
}

async function sendToS3(strResult = '', objectKey = 'spaces.json') {
  try {
    let uploadParams = {
      Bucket: 'avl-parking-decks',
      Key: objectKey,
      Body: strResult,
    };

    const command = new PutObjectCommand(uploadParams);
    const response = await s3_client.send(command);
    console.log('S3 response:', response.$metadata.httpStatusCode);
  } catch (err) {
    console.log('S3 Err: ', err);
  }
}

function sortGarages(garage_data) {
  garage_data.sort(function (a, b) {
    return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
  });
  return garage_data;
}

export async function handler(event, context, callback) {
  // to indicate that a garage is closed, add its slug to this array:
  const CLOSED_GARAGES = [];

  try {
    const secrets = await getSecrets('parking_logix');
    let logix = await getParkingLogix(secrets);

    let spaces = { decks: [] };
    let parkingDecks = logix[0];

    for (let i = 0; i < parkingDecks.length; i++) {
      let garage = {};

      if (parkingDecks[i].location_name.includes('Wall')) {
        garage.name = 'Wall Street';
        garage.slug = 'wall-street';
        garage.address = '45 Wall St, Asheville, NC 28801';
        garage.coords = [35.59463097210988, -82.55698255217752];
      } else if (parkingDecks[i].location_name.includes('Biltmore')) {
        garage.name = 'Biltmore Avenue';
        garage.slug = 'biltmore-avenue';
        garage.address = '61 S Lexington Ave, Asheville, NC 28801';
        garage.coords = [35.592505193480854, -82.55159180267485];
      } else if (parkingDecks[i].location_name.includes('Harrah')) {
        garage.name = "Harrah's Cherokee Center";
        garage.slug = 'civic-center';
        garage.address = '68 Rankin Ave, Asheville, NC 28801';
        garage.coords = [35.59670054502899, -82.55416494084967];
      } else if (parkingDecks[i].location_name.includes('Rankin')) {
        garage.name = 'Rankin Avenue';
        garage.slug = 'rankin-avenue';
        garage.address = '12 Rankin Ave, Asheville, NC 28801';
        garage.coords = [35.59574383564083, -82.5538445980123];
      }

      garage.available = CLOSED_GARAGES.includes(garage.slug)
        ? 'closed'
        : parkingDecks[i].free_spaces;

      garage.url = 'https://www.ashevillenc.gov/service/park-in-a-parking-garage/';
      garage.jurisdiction = 'city';

      spaces.decks[i] = garage;
    }

    await sendToS3(JSON.stringify(spaces), 'spaces.json');
    console.log('City garages JSON: ', JSON.stringify(spaces));

    let countyGarages = await getCountyDecks();
    let allGarages = spaces.decks.concat(countyGarages);
    allGarages = sortGarages(allGarages);

    await sendToS3(JSON.stringify({ decks: allGarages }), 'all-spaces.json');
    console.log('All garages JSON: ', JSON.stringify({ decks: allGarages }));
  } catch (error) {
    console.log(error);
  }
}
