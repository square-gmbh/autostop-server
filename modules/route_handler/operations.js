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

    console.log(link.data);

    link.res.setHeader('Access-Control-Allow-Origin', link.headers.origin);
    link.res.writeHead(200, {'Content-Type': 'text/plain'});
    link.res.end(JSON.stringify(link.data));
}