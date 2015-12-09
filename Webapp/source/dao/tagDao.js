var pg = require('pg');
var environments = require('../config/environments')
var conString = environments.conString;

function loadTags(callback, callbackRes) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('SELECT * FROM "Tag"', function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        client.end();
        callback(mapRows(result.rows), callbackRes);
      });
    });
}

function mapRows(tags){
    var mappedTags = [];
    for (tag of tags){
        mappedTags.push({Id: tag.id, Name: tag.name});
    }
    return mappedTags;
}

module.exports.loadTags = loadTags;
