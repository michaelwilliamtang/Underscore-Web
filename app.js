const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
// const clipboardy = require('clipboardy');
// const xsel = require('xsel');

const app = express();

// SETUP
// load env keys
require('dotenv/config');

// load models
// require('./models/User');

// load passport config
require('./config/passport')(passport);

// load routes
const index = require('./routes/index');
const posts = require('./routes/posts');
const auth = require('./routes/auth');
const account = require('./routes/account');

// load helpers
const {
    formatDate, truncate, select, accessIcons
} = require('./helpers/hbs');
const {getHostname} = require('./helpers/get-hostname');

// mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// MIDDLEWARE
// handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
        formatDate: formatDate,
        truncate: truncate,
        select: select,
        accessIcons: accessIcons
    },
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override middleware
app.use(methodOverride('_method'));

// setup session
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// setup flash
app.use(flash());

// setup global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

app.use('/', index);
app.use('/auth', auth);
app.use('/posts', posts);
app.use('/account', account);

// LISTEN
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});