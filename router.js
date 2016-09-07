/**
 * Created by Yaniv on 07/09/2016.
 */

function route(handle, pathname)
{
    console.log("About to route a request for "+ pathname);
    if(typeof(handle[pathname]) == 'function'){
        handle[pathname]();
    }
    else{
        console.log("No request handler found for "+ pathname);
    }
}

exports.route = route;