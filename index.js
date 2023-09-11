const sqlite3 = require('sqlite3');
const express = require('express');

const app = express();
let db = new sqlite3.Database('./database/images.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to image database');
});

app.route('/images/')
    .get((req, res) => {
        let sql;
        let character = req.query.character || 'all';
        if (character === 'all') {
            sql = `SELECT art.fname FROM ((art INNER JOIN contains ON art.art_id = contains.art_id)
INNER JOIN characters ON contains.char_id = characters.char_id)`
        } else {
            sql = `SELECT art.fname, art.nsfw, art.alt_text FROM 
((art INNER JOIN contains ON art.art_id = contains.art_id)
INNER JOIN characters ON contains.char_id = characters.char_id) 
WHERE characters.name = ${character}`;
        }

        let filenames = db.all(sql);

    })
    .post((req, res) => {
        res.send('This should authenticate me somehow, then add image to database')
    })
    .put((req, res) => {
        res.send('This should edit a current entry if it exists')
    })


db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Closed connection to database')
})