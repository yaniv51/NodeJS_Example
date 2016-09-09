/**
 * Created by Yaniv on 07/09/2016.
 */

var exec = require("child_process").exec;
var querystring = require("querystring"),
    fs = require("fs"),
    url = require("url");
    pathModule = require("path"),
    util = require('util'),
    formidable = require("formidable");

function start(response, request) {
    console.log("Request handler: 'start' was called");

    //redirect to index page
    var htmlPath = __dirname + "/pages/index.html";
    writeResponseHtmlPath(response, htmlPath);
}


function uploadPage(response){
    console.log("Request handler: 'uploadPage' was called");

    //redirect to upload page
    var htmlPath = __dirname + "/pages/uploadPage.html";
    writeResponseHtmlPath(response, htmlPath);
}


function upload(response, request){
    console.log("Request handler: 'upload' was called");

    //ignore get method
    if(request.method.toLocaleLowerCase() != 'post'){
        writeNotFound(response);
    }

    var form = new formidable.IncomingForm();
    console.log("about to parse");

    form.parse(request, function(error, fields, files){
        console.log("parsing images...");

        if(error){
            console.log("Error while parsing");
        }
    });

    form.on('end', function(fields, files) {
        var index;
        var files = "";
        var totalFiles = this.openedFiles.length;

        if(this.openedFiles.length == 0){
            console.log("error with uploading");
            writeNotFound(response);
            return;
        }

        //copy all uploaded files
        for(index = 0; index<this.openedFiles.length; index++){
            var currentPath = this.openedFiles[index].path;
            var currentName = this.openedFiles[index].name;

            currentName = currentName.replace(/ /g,"_");

            if(files.length > 0)
                files += "<br/>";
            files += currentName;

            fs.rename(currentPath, __dirname + "/tmp/" +currentName, function(error){
                if(error){
                    fs.unlink(__dirname + "/tmp/" + currentName);
                    fs.rename(files.upload.path, __dirname + "/tmp/" + currentName);
                }
            })
        }
        files += "<br/>";

        var htmlContent = '<!DOCTYPE html>' +
        '<html lang="en">' +
            '<head>  <meta charset="UTF-8"> </head>' +
            '<body>' +
                'Your ' +(totalFiles == 1? 'file' : 'files') +':<br/>' + files +
            (totalFiles ==1 ? 'has ':'have ') + 'been received <br/>'+
            'Total '+ totalFiles + (totalFiles == 1? ' file':' files') +
            '</body> ' +
            '<form action=/start method=get>' +
                '<input type=submit value="Back"' + '/>' +
            '</form>' +

            '</html>';

        console.log("response with html");
        writeResponseHtml(response, htmlContent);
    });
}

function show(response, request){
    var query = url.parse(request.url).query;
    var imageName = querystring.parse(query)["path"];

    console.log("Request handle 'show' was called for image: " + imageName);
    var imagePath = __dirname + "/tmp/" + imageName;

    if(fs.existsSync(imagePath)){
        writeImageResponse(response, imagePath);
    }
    else{
        writeImageResponse(response, __dirname+"/internalImages/null.png")
    }
}

function getFiles(response){
    var path = __dirname + "/tmp/";
    fs.readdir(path, function(err, files){
        response.write(JSON.stringify(files));
        response.end();
    })
}

function writeImageResponse(response, path){
    response.writeHead(200, {"Content-type" : "image/jpg"});
    fs.createReadStream(path).pipe(response);
}

function writeResponseText(response, content){
    response.writeHead(200, {"Content-type" : "text/plain"});
    response.write(content);
    response.end();
}

function writeResponseShowImage(response){
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
}

function writeResponseHtml(response, htmlContent){
    response.writeHead(200, {"Content-type" : "text/html"});
    response.write(htmlContent);
    response.end();
}

function writeNotFound(response){
    response.writeHead(200, {"Content-type" : "tlext/htm"});
    response.write("404 Not found");
    response.end();
}

function writeResponseHtmlPath(response, htmlPath){
    fs.readFile(htmlPath, function (err, htmlData){
        if(err){
            //handle error
            writeNotFound(response);
            return;
        }
        writeResponseHtml(response, htmlData);
    })
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.getFiles = getFiles;
exports.uploadPage = uploadPage;