if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoSanitize = require('express-mongo-sanitize');
const flash = require('connect-flash');
// const flash = require('express-flash');
const helmet = require('helmet')
const port = process.env.PORT || 3004;

// const mongoConnect = require('./db/mongoose')
const db = require('./db/mongoose')
const User = require('./models/user');
// const Product = require('./models/product');

// routes
const userRoutes = require('./router/user');
const productRoutes = require('./router/product');
// const mongoose = require('mongoose');

const MongoStore = require('connect-mongo')
// const MongoStore = require('connect-mongo')(session);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(methodOverride('_method')); // for changing post requests.
app.use(express.static(path.join(__dirname,'public')))

app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

const dbUrl = process.env.PORT ? process.env.ONLINE_MONGODB_URL : process.env.MONGODB_URL;


const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60
    }),
    name: process.env.SESSION_NAME, 
    secret: process.env.MONGODB_SECRET, 
    resave: false,
    saveUninitialized: true,
    // saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,  // after deployment uncomment
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig)); // must always be above "passport.session under"
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://res.cloudinary.com/"
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "default-src": [],
            connectSrc: ["'self'", ...connectSrcUrls],
            "script-src": ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            "style-src": ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            "img-src": [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dfhhjkekb/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            "font-src": ["'self'", ...fontSrcUrls],
            'style-src-elem': ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session()); // this line must always be under sessin (i.e two lines above
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use(productRoutes);
app.use(userRoutes);




app.listen(port, () => {
    console.log(`PHASIONISTER IS RUNNING ON PORT ${port} RIGHT NOW...`);
})



// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             "default-src":[ "'self'" ],
//             "base-uri":[ "'self'" ],
//             "font-src":[ "'self'", "https:", "data:" ],
//             "frame-ancestors":[ "'self'" ],
//             "img-src":[ "'self'", "data:", "http://res.cloudinary.com"], //<--- HERE
//             "script-src":[ "'self'" ],
//             "script-src-attr":[ "'none'" ],
//             "style-src":[ "'self'", "https:", "'unsafe-inline'" ],
//         }
//     })
// );

