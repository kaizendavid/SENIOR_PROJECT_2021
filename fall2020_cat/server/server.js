
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
//const path = require('path');

dotenv.config({path: './config/config.env'});
//connect to mongodb
connectDB();



const app = express();


//MIDDLEWARE
app.use(express.json());
/*

//Middleware to check to see if the user has been logged in and has a session
const checkSessionExists = (req, res, next) => {
    if(req.session.userSession){
        console.log("you have a session set");

        next();

    }else{

        return res.status(400).send({
            success: false,
            error: "you are not authenicated to go into this route"
        });
    }
}

*/

//test-app.use((req, res, next) => {
  //  console.log(req);
//});

app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: process.env.SESS_SECRET,
    saveUninitialized: false, // don't create session until something stored
    resave: false,
    unset: 'destroy',
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 60*60*24*7, // 7 day session storage in seconds
    }),
    cookie: {
        maxAge: 1000*60*60*24, // 24 hour cookie storage in milliseconds process.env.SESS_LIFETIME
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' ? true : false
    },
    rolling: true
}))

//used to see session values
app.use((req, res, next) => {
    
    console.log(req.session);
    console.log("session.id: " + req.session.id);
    next();
});

/*test-to see if sessions is working correctly. Modify session to see if session.id cookie is on client side
and then deleting it
app.use((req, res, next) => {
    req.session.auth = true;
    next();
});

app.use((req, res, next) => {
    if(!req.session.type)
    req.session.destroy(() => {
        console.log("session on mongodb deleted");
    });
    next();
});
*/



//routes going to 'api/auth' need authentication and redirected/routed to 'routes/auth.routes'

app.use("/api/public/", require("./routes/public-routes"));
app.use("/api/auth", require("./routes/auth-routes"));
app.use('/api/auth/session', require('./routes/session-routes'));
app.use("/api/auth/coursework", require("./routes/coursework-routes"));
app.use("/api/auth/userinfo", require("./routes/userinfo-routes"));

//home route
app.get('/', (req, res) => {
    res.send('<html><h1>This is the home page</h2></html>');
});

//handle for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status(404).send({message: "404 server missing pages."});
    console.log("404 server missing page on server");
});

//handle for 500 - Internal Server Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendFile(path.join(__dirname, './public/505.html'))
});


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
