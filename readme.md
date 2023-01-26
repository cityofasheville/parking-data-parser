Where’s Parking is a GitHub pages hosted React app. The app makes a GET request to a static JSON file in an Amazon S3 bucket every 10 seconds to get fresh data.

The JSON file on S3 is created and updated by an AWS lambda function, in the enterprise-asheville account: FormatParkingAndPushToPublicS3


(This functionality was previously implemented by a node app running on an on-premises city server. If you are interested in implementing something like the old setup, view the prior versions in this repo's commit history).

Currently, a windows scheduled task is called by the Windows Task Scheduler every 1 minute. It uses the Amazon cli to push the raw file from //coa-parking-app1/Count/webcount.dat into a private S3 bucket. A lambda function then formats the parking deck data into JSON, then writes the JSON data to a file (spaces.json) and pushes that JSON to the public S3 bucket.

UI Code: https://github.com/cityofasheville/wheres-parking (its served from the gh-pages branch)

Where's Parking site: http://cityofasheville.github.io/wheres-parking/

AWS S3 bucket: https://s3.amazonaws.com/asheville-parking-decks/spaces.json

It’s embedded in the City’s website here: http://www.ashevillenc.gov/Departments/ParkingServices/FindParking.aspx
