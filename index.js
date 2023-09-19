const sqlite3 = require('sqlite3');
const express = require('express');
const pug = require('pug')
const path = require('path');
const db = require('./database.js')

const app = express();
app.set('view engine', 'pug');
const port = 8000


app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
    res.render('home_view',
        {
            title: 'Founded\'s Homepage',
            welcome_message: "Hi I'm Founded"
        })
});


app.route('/images/')
    .get((req, res) => {
        let sql;
        let character = req.query.character || 'all';
        if (character === 'all') {
            sql = `SELECT DISTINCT art.fname, art.id FROM ((art INNER JOIN contains ON art.id = contains.art_id));`
        } else {
            sql = `SELECT DISTINCT art.fname, art.nsfw, art.alt_text FROM
            ((art INNER JOIN contains ON art.id = contains.art_id)
            INNER JOIN characters ON contains.char_id = characters.id)
            WHERE characters.name == "${character}";`
        }

        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(400);
                return;
            }
            let filenames = {};
            rows.forEach(function(row) {
                filenames[row.id] = row.fname;
            })

            res.render('gallery_template', 
            {
                title: 'Founded\'s Commissioned Art', 
                art_filenames: filenames}
            );;
        })
    })
    .post((req, res) => {
        res.send('This should authenticate me somehow, then add image to database')
    })
    .put((req, res) => {
        res.send('This should edit a current entry if it exists')
    })




app.listen(port, () => {
    console.log(`Listening on ${port}`)
})