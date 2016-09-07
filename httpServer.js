/**
 * Created by Yaniv on 07/09/2016.
 */

var http = require('http');
var url = require('url');
//var formidable = require('formidable'), sys = require('sys');

function start(route, handle) {
    function onRequest(request, response) {
        var pathName = url.parse(request.url).pathname;
        console.log("request for "+ pathName +" recived");
        route(handle, pathName, response, request);
        /*var postData = "";
        request.setEncoding("utf8");

        request.addListener("data", function(postDataChunk){
            postData += postDataChunk;
            console.log("Received POST data chunk '" + postDataChunk +"'.");
        })

        request.addListener("end", function(){
            route(handle, pathName, response, postData);
        })*/
    }

    http.createServer(onRequest).listen(8888);
    console.log("server has started with port 8888");
}

exports.start = start;
