Parking-data-parser loads the data that Where's Parking reads from the vendor API. It is a Lambda in custom-asheville account that is called once a minute.

Where’s Parking is a GitHub pages hosted React app. The app makes a GET request to a static JSON file in an Amazon S3 bucket every 10 seconds to get fresh data.

UI Code: https://github.com/cityofasheville/wheres-parking (its served using AWS Amplify)

Where's Parking site: https://wheresparking.ashevillenc.gov

AWS S3 bucket: https://s3.amazonaws.com/avl-parking-decks/spaces.json

It’s embedded in the City’s website here: https://www.ashevillenc.gov/service/find-real-time-parking-in-parking-garages/




API Key is in secrets manager:

{
"logix_url": "https://api.streetsoncloud.com/pl1/multi-lot-info",
"logix_apikey": "xxxxx"
}




Parking Logix API returns this data:
https://api.streetsoncloud.com/pl1/multi-lot-info
``` json
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

This script writes spaces.json to S3 'avl-parking-decks'
{
  "decks": [
    {
      "name": "Rankin Ave Garage",
      "available": "106",
      "coords": [
        35.596756575901,
        -82.554218986941
      ]
    },
    {
      "name": "Wall Street Garage",
      "available": "44",
      "coords": [
        35.59461343674,
        -82.556525862251
      ]
    },
    {
      "name": "Biltmore Ave.Garage",
      "available": "156",
      "coords": [
        35.592322076548,
        -82.55143519361
      ]
    },
    {
      "name": "Harrah's Cherokee Center Garage",
      "available": "189",
      "coords": [
        35.596718496827,
        -82.554197997403
      ]
    }
  ]
}

## Usage
First run ```npm install```

```package.json``` has these scripts:
- Test Locally: 
  - ```npm start``` (or for a Python program: ```npm run startpy```)
- Deploy: 
  - ```npm run deploy```
- Destroy: (removes all objects from AWS)
  - ```npm run destroy```
- Clean: 
  - ```npm run clean``` (removes local temp files)

The Deploy/Destroy commands use the name of the active GitHub branch when creating AWS resources.
For example, if the active GitHub branch is "feature" and the name of the resource is "template", the resource is named "template_feature". For API gateway domains, it's "feature-template.ashevillenc.gov". Production (or main) branches do not get a prefix/suffix.