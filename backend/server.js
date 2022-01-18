// imports
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');

//config
require('./config/db');
require('./config/auth')(passport);

// express middleware
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(passport.initialize());

// Https stuff
const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.cert');
const server = https.createServer({key :key, cert: cert}, app);
const port = process.env.PORT || 3001;

// Routes
const userRoute = require('./routes/users');
const authRouter = require('./routes/auth');
const ieeeRouter = require('./routes/ieee');
const eventRouter = require('./routes/event');
const propointRouter = require('./routes/propoint');

// API calls
app.use('/api/user', userRoute);
app.use('/api/', authRouter);
app.use('/api/ieee', ieeeRouter);
app.use('/api/event', eventRouter);
app.use('/api/propoint', propointRouter);

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.listen(port, () =>{
    console.log(`listening on port: ${port}`);
});