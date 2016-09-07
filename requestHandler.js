/**
 * Created by Yaniv on 07/09/2016.
 */

function start(){
    console.log("Request handler: 'start' was called");
}

function upload(){
    console.log("Request handler: 'upload' was called");
}

exports.start = start;
exports.upload = upload;