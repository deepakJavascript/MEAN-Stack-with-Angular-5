const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
var cors = require('cors')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config/database'); // Mongoose Config
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);
const bodyParser = require('body-parser');

mongoose.connect(config.uri, (err) => {
    if (err) {
      console.log('Could NOT connect to database: ', err);
    } else {
      console.log('Connected to database: ' + config.db);
    }
  });

    app.use(cors({ origin: 'http://localhost:4200' }));
    app.use(bodyParser.urlencoded({ extended: false }))
 // parse application/json
    app.use(bodyParser.json());

    app.use('/authentication', authentication);
    app.use('/blogs', blogs)

app.get('/', (req, res) =>{
    res.send('Hello world');
});

app.listen(3000, (err) =>{

    if(err){
        console.log('Server not running');
    }
    else{
        console.log('Server is running on 3000');
    }
});
