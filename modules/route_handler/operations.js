var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


/* this function searches for routes */

/* request data example */
/*
*   {
*       "start": "Cluj-Napoca",
*       "destination": "Brasov",
*       "date": "02.04.2014"
*   }
*/
exports.search = function (link) {
    link.res.setHeader('Access-Control-Allow-Origin', link.headers.origin);

    var route = link.data;
    if (!route.start || !route.destination || !route.date) {
        link.res.writeHead(400);
        link.res.end('ERR_BAD_ROUTE');
        return;
    }

    // start the search operation
    getCollection('routes', function (err, col) {

        if (err) {
            link.res.writeHead(500);
            link.res.end(JSON.stringify(err));
            return;
        }

        //STAGE I
        // using start and destination
        col.find({ 'start': route.start, 'destination': route.destination, 'date': route.date}).toArray(function (err, routes1) {

            if (err) {
                link.res.writeHead(500);
                link.res.end(JSON.stringify(err));
                return;
            }

            //STAGE II
            // using via
            col.find({ 'via': { $in : [route.start, route.destination] }}).toArray(function (err, routes2) {

                if (err) {
                    link.res.writeHead(500);
                    link.res.end(JSON.stringify(err));
                    return;
                }

                // merge the 2 results
                var result = mergeRoutes(routes1, routes2);
                link.res.writeHead(200);
                link.res.end(JSON.stringify(result));
            });
        });
    });
};

/* this function creates routes */

/* request data example */
/*
*   {
*       "start": "Cluj-Napoca",
*       "destination": "Brasov",
*       "via": "Turda, Targu Mures",
*       "seats": "3",
*       "notes": "nu iau tigani",
*       "hour": "13",
*       "minutes": "45"
*       "date": "02.04.2014"
*   }
*/
exports.create = function (link) {
    link.res.setHeader('Access-Control-Allow-Origin', link.headers.origin);

    // get the route
    var route = link.data;

    // validate the route
    if (!route.start || !route.destination || !route.date || !route.seats) {
        link.res.writeHead(400);
        link.res.end('ERR_BAD_ROUTE');
        return;
    }

    // connect to mongo
    getCollection('routes', function (err, col) {

        if (err) {
            link.res.writeHead(500);
            link.res.end(JSON.stringify(err));
            return;
        }

        // handle via
        if (route.via) {
            route.via = route.via.split(',');

            // trim
            for (var i in route.via) {
                route.via[i].trim();
            }
        }

        // insert the route
        col.insert(route, function (err) {

            if (err) {
                link.res.writeHead(500);
                link.res.end(JSON.stringify(err));
                return;
            }

            link.res.writeHead(200);
            link.res.end('OK');
            return;
        });
    });
}

// private function
function getCollection (collection_name, callback) {

    // connect to mongo
    MongoClient.connect('mongodb://127.0.0.1:27017/autostop', function (err, db) {
        
        if (err) {
            callback(err);
            return;
        }

        var collection = db.collection(collection_name);

        callback(null, collection);
    });
}

// merges the 2 stages of the route search operation preventing duplicates
// private function
function mergeRoutes (routes1, routes2) {

    var result = [];
    result = routes1;

    // add the 2 stage routes to the array but check for duplicates
    for (var i in routes2) {

        var found = false;
        for (var j in result) {
            if (result[j]._id.toString() === routes2[i]._id.toString()) {
                found = true;
                break;
            }
        }

        if (!found) {
            result.push(routes2[i]);
        }
    }

    return result;
}