'use strict'
//const AWS = require('aws-sdk');

var MongoClient = require('mongodb').MongoClient;

let atlas_connection_uri;
let cachedDb = null;

function connectToDatabase(uri) {
    console.log('=> connecting to database');
    if (cachedDb) {
        console.log('=> using cached database instance');
        return Promise.resolve(cachedDb);
    }

    return MongoClient.connect(uri)
        .then(db => { cachedDb = db; return cachedDb; });
}


exports.handler = (event, context, callback) => {
    console.log(event);
    var uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
    context.callbackWaitsForEmptyEventLoop = false;
    if (atlas_connection_uri == null) {
        atlas_connection_uri = uri;
        /*
          const kms = new AWS.KMS();
          kms.decrypt({ CiphertextBlob: new Buffer(uri, 'base64') }, (err, data) => {
              if (err) {
                  console.log('Decrypt error:', err);
                  return callback(err);
              }
              
              atlas_connection_uri = data.Plaintext.toString('ascii');
            });
            */
    }
    processEvent(event, context, callback);
};

function processEvent(event, context, callback) {
    connectToDatabase(atlas_connection_uri)
        .then(db => queryDatabase(db, event))
        .then(result => {
            callback(null, result);
        })
        .catch(err => {
            console.log('=> an error occurred: ', err);
            callback(err);
        });
}

function queryDatabase(db, event) {
    var jsonContents = JSON.parse(JSON.stringify(event));
    return db.collection('restaurants').aggregate([{ $match: { "address.zipcode": "10036", "cuisine": "Italian", "name": new RegExp('M') } },
    { $project: { "_id": 0, "name": 1, "address.building": 1, "address.street": 1, "borough": 1, "address.zipcode": 1, "healthScoreAverage": { $avg: "$grades.score" }, "healthScoreWorst": { $max: "$grades.score" } } }
    ]).toArray()
        .then(docs => {
            return { docs };
        })
        .catch(err => { return { statusCode: 500, body: 'error' }; });
}