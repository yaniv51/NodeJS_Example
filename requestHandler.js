/**
 * Created by Yaniv on 07/09/2016.
 */

var exec = require("child_process").exec;
var querystring = require("querystring"),
    fs = require("fs"),
    path = require("path"),
    formidable = require("formidable");

function start(response, request){
    console.log("Request handler: 'start' was called");

    var body = '<html>'+
                '<head>'+
                    '<meta http-equiv="Content-Type" '+
                    'content="text/html; charset=UTF-8" />'+
                '</head>'+
                '<body>'+
                    '<form action="/upload" enctype="multipart/form-data" '+
                        'method="post">'+
                        '<input type="file" name="upload" multiple="multiple">'+
                        '<input type="submit" value="Upload file" />'+
                    '</form>'+
                '</body>'+
               '</html>';

    writeResponseHtml(response, body);
}

function sleep(miliSeconds){
    var startTime = new Date().getTime();
    while(new Date().getTime() < startTime + miliSeconds);
}

function upload(response, request){
    console.log("Request handler: 'upload' was called");

    var form = new formidable.IncomingForm();
    console.log("about to parse");

    form.parse(request, function(error, fields, files){
        console.log("parsing done");
        //in windows, cannot copy-past on existing file - should remove file first
        fs.rename(files.upload.path, __dirname + "/tmp/test.jpg", function(error){
            if(error){
                fs.unlink(__dirname + "/tmp/test.jpg");
                fs.rename(files.upload.path, __dirname + "/tmp/test.jpg");
            }
        })
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
}

function show(response){
    console.log("Request handle 'show' was called.");
    response.writeHead(200, {"Content-type" : "image/jpg"});
    var filePath = __dirname + "/tmp/test.jpg";
    fs.createReadStream(filePath).pipe(response);
}

function writeResponseText(response, content){
    response.writeHead(200, {"Content-type" : "text/plain"});
    response.write(content);
    response.end();
}

function writeResponseHtml(response, htmlContent){
    response.writeHead(200, {"Content-type" : "text/html"});
    response.write(htmlContent);
    response.end();
}

exports.start = start;
exports.upload = upload;
exports.show = show;