'use strict';

//Application Dependenices
const express = require('express');
const cors = require('cors');
const pg = require('pg');

//Application Setup

const app = express();
const PORT = process.env.PORT;

//Database Setup

//For mac
// const conString = 'postgres://localhost:5432/books_app';

//For linux
// const conString = "postgresql://postgres:1234@localhost:5432/books_app";
// const conString = process.env.DATABASE_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

//Application Middleweare
app.use(cors());

//API Endpoints
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