/**
 * Created by Yaniv on 07/09/2016.
 */

var server = require("./server");
var router = require("./router");
var requestHandler = require("./requestHandler");

var handle = {}; 
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["upload"] = requestHandler.upload;

server.start(router.route, handle);