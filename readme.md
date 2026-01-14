# Parking-data-parser

## Overview

Parking-data-parser is a Lambda function that consolidates and normalizes parking garage data from Buncombe County and City of Asheville. The data is written to a single JSON file that is read by the Where's Parking app. The County data is pulled from their individual JSON files and the City data is pulled from its vendor API.

Parking-data-parser is a Lambda in the custom-asheville account that is triggered once a minute.

The [Where's Parking](https://wheresparking.ashevillenc.gov/) frontend is a React app hosted on AWS Amplify. Visit the [Where's Parking Github repo](https://github.com/cityofasheville/wheres-parking) for more information about the frontend.

It’s embedded in the City’s website here: https://www.ashevillenc.gov/service/find-real-time-parking-in-parking-garages/

## Data Locations

### S3 Bucket

Parking data is output by parking-data-parser to an AWS S3 bucket:
https://s3.amazonaws.com/avl-parking-decks/

### Output: Consolidated JSON with all data (all-spaces.json)

This is produced by the parking-data-parser Lambda function. Note the that the parking-data-parser Lambda function transforms data in the consolidation process to enhance the frontend app.

[https://s3.amazonaws.com/avl-parking-decks/all-spaces.json](https://s3.amazonaws.com/avl-parking-decks/all-spaces.json) (custom-asheville)

#### Shape of data in sll-spaces.json

```json
[
  [
    {
      "name": "College Street",
      "slug": "college-street",
      "address": "164 College St, Asheville, NC 28801",
      "coords": [35.597220568749506, -82.54918944554281],
      "available": 175,
      "url": "https://www.buncombenc.gov/673/Public-Parking",
      "jurisdiction": "county"
    }
  ]
]
```

### Output: JSON with City-only data (spaces.json)

This is also produced by the parking-data-parser Lambda function for any existing usage that expects spaces.json to include only City garage data. It has some new properties added to match the consolidated JSON file.

[https://s3.amazonaws.com/avl-parking-decks/spaces.json](https://s3.amazonaws.com/avl-parking-decks/spaces.json) (custom-asheville)

#### Shape of data in spaces.json

```json
[
  [
    {
      "name": "Rankin Avenue",
      "slug": "rankin-avenue",
      "address": "12 Rankin Ave, Asheville, NC 28801",
      "coords": [35.59574383564083, -82.5538445980123],
      "available": "125",
      "url": "https://www.ashevillenc.gov/service/park-in-a-parking-garage/",
      "jurisdiction": "city"
    }
  ]
]
```

### Input: JSON with raw County data

[https://s3.amazonaws.com/bc-parking-decks/164College](https://s3.amazonaws.com/bc-parking-decks/164College) (enterprise-asheville)

[https://s3.amazonaws.com/bc-parking-decks/40Coxe](https://s3.amazonaws.com/bc-parking-decks/40Coxe) (enterprise-asheville)

#### Shape of County data

```json
[
  [
    {
      "decks": [
        {
          "name": "164 College",
          "available": 180,
          "coords": [35.596902, -82.548801]
        }
      ]
    }
  ]
]
```

### Input: City Parking Vendor (Parking Logix)

#### API Key

Stored in AWS secrets manager

```json
{
  "logix_url": "https://api.streetsoncloud.com/pl1/multi-lot-info",
  "logix_apikey": "xxxxx"
}
```

#### Parking Logix endpoint

https://api.streetsoncloud.com/pl1/multi-lot-info

#### Shape of Parking Logix data

```json
[
  [
    {
      "location_name": "The Historic Downtown Parking",
      "geocode": "(29.898319548148,-81.315417134891)",
      "location_address": "Visitor Information Center",
      "total_spaces": "1143",
      "free_spaces": "938",
      "occupancy": 18
    }
  ]
]
```

## Usage

First run `npm install`

`package.json` has these scripts:

- Test Locally:
  - `npm start` (or for a Python program: `npm run startpy`)
- Deploy:
  - `npm run deploy`
- Destroy: (removes all objects from AWS)
  - `npm run destroy`
- Clean:
  - `npm run clean` (removes local temp files)

The Deploy/Destroy commands use the name of the active GitHub branch when creating AWS resources.
For example, if the active GitHub branch is "feature" and the name of the resource is "template", the resource is named "template_feature". For API gateway domains, it's "feature-template.ashevillenc.gov". Production (or main) branches do not get a prefix/suffix.
