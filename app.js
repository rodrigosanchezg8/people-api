import {peopleRouter} from "./people/people-router";

const express = require('express');
const cors = require('cors');

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('People api');
});

app.listen(port, () => {
    console.log(`App is live at ${port}`);
});

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

app.use('/api/v1', peopleRouter(express, knex));

