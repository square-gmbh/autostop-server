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

    console.log(link.data);

    link.res.setHeader('Access-Control-Allow-Origin', link.headers.origin);
    link.res.writeHead(200, {'Content-Type': 'text/plain'});
    link.res.end(JSON.stringify(link.data));
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

    // connect to mongo
    getCollection('routes', function (err, col) {

        if (err) {
            link.res.writeHead(500);
            link.res.end(JSON.stringify(err));
            return;
        }

        // get the route
        var route = link.data;

        // validate the route
        if (!route.start || !route.destination || !route.date || !route.seats) {
            link.res.writeHead(400);
            link.res.end('ERR_BAD_ROUTE');
            return;
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