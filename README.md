# DisplayRendersFromWeb-monitoring-processing

# # **[Display Renders From Web-monitoring-processing](https://github.com/ftsalamp/DisplayRendersFromWeb-monitoring-processing)**

**THIS PROJECT IS STILL UNDER HEAVY DEVELOPMENT! MANY THINGS ARE STILL BROKEN.**
This project uses a lot of code from the [web-monitoring-ui](https://github.com/edgi-govdata-archiving/web-monitoring-ui) project. It aims to query the web-monitoring-processing server directly and then render the changes depending on the parameters given.


# Usage

Run the server with the command `yarn start`
The URL calls should look like this: 

> http://localhost:port(default 3000)/snapshotAURL/snapshotBURL/diffingMethod

Example request: http://localhost:3002/https%3A%2F%2Fedgi-versionista-archive.s3.amazonaws.com%2Fversionista1%2F69957-6026616%2Fversion-10663938.html/https%3A%2F%2Fedgi-versionista-archive.s3.amazonaws.com%2Fversionista1%2F69957-6026616%2Fversion-10663938.html/SIDE_BY_SIDE_RENDERED
