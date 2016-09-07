/**
 * Created by Yaniv on 07/09/2016.
 */

var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        var pathName = url.parse(request.url).pathname;
        console.log("request for "+ pathName +" recived");

        route(handle, pathName);

        response.writeHead(200, {"Content-type" : "text/plain"});
        response.write("\n\nHello world");
        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("server has started with port 8888");
}

exports.start = start;
