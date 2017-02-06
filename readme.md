Where’s Parking is a GitHub pages hosted AngularJS app. The app makes a GET request to a static JSON file in an Amazon S3 bucket every 10 seconds to get fresh data. The JSON file on S3 is created and updated by a this script running on coa-gis-fme1. This script reads a file from //coa-parking-app1/Count/webcount.dat and converts the parking deck data in the file into JSON, writes the JSON data to a file (spaces.json) and then pushes that JSON to S3. The NodeJS script itself is launched by parking-parser.bat which is called by the Windows task scheduler every 15 minutes. The file parking-parser.bat launches the node app using forever to keep it running. Check the task scheduler to get the location of the script in the FME server.

UI Code: https://github.com/cityofasheville/wheres-parking (its served from the gh-pages branch)

Where's Parking site: http://cityofasheville.github.io/wheres-parking/


AWS S3 bucket: https://s3.amazonaws.com/asheville-parking-decks/spaces.json

It’s embedded in the City’s website here: http://www.ashevillenc.gov/Departments/ParkingServices/FindParking.aspx