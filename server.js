const express = require('express'),
    bodyParser = require('body-parser');

const app = express();
const index= require('./routes/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('', index);

app.listen(3001, () => {
    console.log(`Listen port 3001`);
});