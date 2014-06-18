var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

/* this function checks if the user exists and if not
it creates it */

/* user object example */
/*
*   {
*       "email": "dan.andrei@square.com",
*       "firstName": "Dan",
*       "lastName": "Andrei",
*       "profileId": "some id"
*   }
*/
exports.setUser = function (link) {
    // set the response header
    link.res.setHeader('Access-Control-Allow-Origin', link.headers.origin);

    if (!link.data.params) {
        link.res.writeHead(400);
        link.res.end('Bad request');
        return;
    }

    // get the user
    var user = link.data.params;

    getCollection('users', function (err, col) {

        if (err) {
            link.res.writeHead(500);
            link.res.end(JSON.stringify(err));
            return;
        }

        // find the user
        col.findOne({ 'email': user.email }, function (err, doc) {

            if (err) {
                link.res.writeHead(500);
                link.res.end(JSON.stringify(err));
                return;
            }

            // user does not exist so create him
            if (!doc) {

                var newUser = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileId: user.profileId,
                    points: {
                        bad: 0,
                        good: 0
                    }
                }

                // insert the new user
                col.insert(newUser, function (err) {

                    if (err) {
                        link.res.writeHead(500);
                        link.res.end(JSON.stringify(err));
                        return;
                    }

                    // all good!
                    link.res.writeHead(200);
                    link.res.end('ok');
                });
            } else {
                // user exists so return
                link.res.writeHead(200);
                link.res.end('ok');

                console.log(doc);
            }
        });
    });

}

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