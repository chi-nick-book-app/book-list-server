'use strict';

//Application Dependenices
const express = require('express');
const cors = require('cors');
const pg = require('pg');

//Application Setup

const app = express();
const PORT = process.env.PORT || 5000;

//Database Setup

//For mac
// const conString = 'postgres://localhost:5432/books_app';

//For linux
//connect to localhost
// const conString = "postgresql://chi:1234@localhost:5432/books_app";
//connent to heroku
const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);

// const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

//Application Middleweare
app.use(cors());

//API Endpoints


//app.post create book
app.post('api/v1/books', (req, res) => {
    console.log('test the form route')
    let SQL = `
INSERT INTO books(title, author, isbn, image_url, description)
VALUES($1, $2, $3, $4, $5);`;
    let values = [
        req.body.title,
        req.body.author,
        req.body.isbn,
        req.body.image_url,
        req.body.description];
    client.query(SQL, values)
        .then(() => res.send('insert complete'))
        .catch(console.error);
});

//app.put   update books
app.put('/api/v1/books/:id', (req, res) => {
    let SQL =
        `UPDATE books 
        SET title=$2, author=$3, isbn=$4, image_url=$5, description=$6
        WHERE book_id=$1;`;


    let values = [
        req.params.id,
        req.body.title,
        req.body.author,
        req.body.isbn,
        req.body.image_url,
        req.body.description];


    client.query(SQL, values)
        .then(() => res.send('update complete'))
        .catch(console.error);




});

// ${req.params.id}
//delete one books
app.delete('/api/v1/books/:id', (req, res) => {
    let SQL = `DELETE FROM books WHERE book_id=$1;`;
    let values = [req.params.id];
    client.query(SQL, values)
        .then(() => res.send('Delete complete'))
        .catch(console.error);
});

// app.get  pick one book
app.get('/api/v1/books/:id', (req, res) => {

    let SQL = `SELECT * FROM books WHERE book_id=$1;`;
    client.query(SQL)
        .then(results => res.send(results.rows))
        .catch(console.error);
    console.log('whatever,just pick one !');


});


//request all the books

app.get('/api/v1/books', (req, res) => {

    console.log('OMG I am handling a GET request by a client !!');
    let SQL = `SELECT *  FROM books;`;
    client.query(SQL)
        .then(results => res.send(results.rows))
        .catch(console.error);
    // res.send('OMG I am in contact with the server !!!!!');

});


//SETUP 404
app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`The server is alive and well and listening on port ${PORT}`));
