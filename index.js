/**
 * Created by Yaniv on 07/09/2016.
 */

var server = require("./httpServer");
var router = require("./router");
var requestHandler = require("./requestHandler");

// #24

var handle = {};
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/upload"] = requestHandler.upload;
handle["/show"] = requestHandler.show;

server.start(router.route, handle);