# Wayback-diff

# # **[Wayback-diff](https://github.com/ftsalamp/wayback-diff)**

This project uses a lot of code from the [web-monitoring-ui](https://github.com/edgi-govdata-archiving/web-monitoring-ui) project. It aims to query the web-monitoring-processing server directly and then render the changes depending on the parameters given.

# Instalation

Install node dependencies with `yarn`

`yarn install`

# Usage

In order for this app to run, the responding web-monitoring-processing server must have a CORS mechanism implemented.
You can find my implementation of a CORS-enabled web-monitoring-processing server [here](https://github.com/ftsalamp/web-monitoring-processing/tree/cors).

Run the server with the command `yarn start`

There are two types of URL calls:
 
**1)**
> http://localhost:port(default 3000)/diffingMethod?format=VALUE&include=VALUE&a=aURL&b=bURL

Example request: http://localhost:3000/SIDE_BY_SIDE_RENDERED?format=json&include=all&a=http://example.org&b=http://example.org

**2)**
> http://localhost:port(default 3000)/diff/TIMESTAMP_A/TIMESTAMP_B/WEBSITE

Example request: http://localhost:3000/diff/20170223193029/20171212125810/archive.org

# Use it as a library

In order to use this app as a library in an other React/JS app you sould run

`build:dev`

In the HTML file you want to use **wayback-diff** library you should include the following code:

```HTML
<script src="../../../../public/wayback-diff.js"></script>
    <script>
      new LoadWaybackDiff();
    </script>
 ```

If you want to test the exported JS library you should run

`example:local`
