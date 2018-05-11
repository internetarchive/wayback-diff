# DisplayRendersFromWeb-monitoring-processing

# # **[Display Renders From Web-monitoring-processing](https://github.com/ftsalamp/DisplayRendersFromWeb-monitoring-processing)**

**THIS PROJECT IS STILL UNDER HEAVY DEVELOPMENT! MANY THINGS ARE STILL BROKEN.**
This project uses a lot of code from the [web-monitoring-ui](https://github.com/edgi-govdata-archiving/web-monitoring-ui) project. It aims to query the web-monitoring-processing server directly and then render the changes depending on the parameters given.


# Usage

In order for this app to run, the responding web-monitoring-processing server must have a CORS mechanism implemented.
You can find my implementation of a CORS-enabled web-monitoring-processing server [here](https://github.com/ftsalamp/web-monitoring-processing/tree/cors).

Run the server with the command `yarn start`
The URL calls should look like this: 

> http://localhost:port(default 3000)/diffingMethod?format=VALUE&include=VALUE&a=aURL&b=bURL

Example request: http://localhost:3000/SIDE_BY_SIDE_RENDERED?format=json&include=all&a=http://example.org&b=http://example.org
