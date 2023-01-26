# STATUS
Rewriting lambdaFunction to pull from Parking Logix API...
Questions about Terraform: Does it need to be in VPC to reach S3? Can I deploy to custom-asheville while S3's are in enterprise-asheville?

When I get the API Key, put it in an env variable:

"logix_url": "https://api.streetsoncloud.com/pl1/multi-lot-info"
"logix_apikey": "xxxxxxx"





https://api.streetsoncloud.com/pl1/multi-lot-info
``` json
[ [
}, ...
{
  "location_name": "<location_name>", 
  "geocode": "(<location_lat>,<location_long>)", 
  "location_address": "<location_address>", 
  "total_spaces": <lot_total_spaces>, 
  "free_spaces": <lot_free_spaces>, 
  "occupancy": <lot_occupancy_percentage>
```



Goal is data shape in spaces.json written to S3 
