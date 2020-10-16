'use strict';

const express = require('express');

const router = express.Router();
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

router.get('/', (req, res) => {

    fs.stat('./config/suscribers.db', function(err, stat) {
        if(err == null) {
            console.log('File exists');
        } else if(err.code === 'ENOENT') {
            // file does not exist
            fs.writeFile('suscribers.db', '');
        } else {
            console.log('Some other error: ', err.code);
        }
    });
    
    let db = new sqlite3.Database('./config/suscribers.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the suscribers database.');
      });

      db.serialize(() => {
        let data = [];
        db.each(`SELECT * FROM suscribers`, (err, row) => {
            if (err) {
                console.log(err);
                throw err;
            }
            data.push(row);
        }, () => {
            res.json({
                data
            });
            console.log('query completed')
        });
    });
});

router.post('/addNewSuscriber', (req, res) => {
    let data = req.body;
    let timestamp = Math.floor(Date.now() / 1000);

    fs.stat('./config/suscribers.db', function(err, stat) {
        if(err == null) {
            console.log('File exists');
        } else if(err.code === 'ENOENT') {
            // file does not exist
            fs.writeFile('suscribers.db', '');
        } else {
            console.log('Some other error: ', err.code);
        }
    });
    
    let db = new sqlite3.Database('./config/suscribers.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the suscribers database.');
      });

      db.serialize(() => {
        // 1rst operation (run create table statement)
        db.run('CREATE TABLE IF NOT EXISTS suscribers(email text, timestamp text)', (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
        }); 
        // 2nd operation (insert into suscribers table statement)
        db.run(`INSERT INTO suscribers(email, timestamp)
                  VALUES('${data.email}', ${timestamp})`, (err) => {
            if (err) {
                res.json({
                    success: 'false',
                    message: err
                });
            } else {
                function timeConverter(UNIX_timestamp){
                    var a = new Date(UNIX_timestamp*1000);
                        var hour = a.getUTCHours();
                        var min = a.getUTCMinutes();
                        var sec = a.getUTCSeconds();
                        var time = hour+':'+min+':'+sec ;
                        return time;
                }
                res.json({
                    success: 'true',
                    email: data.email,
                    when: timeConverter(timestamp)
                });
            }
        });
    });

});

module.exports = router;
