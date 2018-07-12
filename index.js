const express = require ('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blog')(router);
const bodyParser = require('body-parser');
const cors = require('cors');


mongoose.Promise = global.Promise;
mongoose.connect(config.uri , (err) => {
    if(err) {
        console.log('could not connect to database', err)
    } else {
        console.log('connected to database: ' + config.db)
    }
});




//Middleware

app.use(cors({
    origin: 'http//:localhost:4200'
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(8080, () => {
    console.log('listen on port 8080');
});