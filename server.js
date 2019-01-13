const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const pJSON = require('./package');

const PORT = process.env.PORT || 3000;

const app = express();

// Handlebars page helpers
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('getAuthorName', () => pJSON.author);
hbs.registerHelper('getHeadingMessage', message => `Welcome to the ${message}.`);

// Handlebars partials
hbs.registerPartials(`${__dirname}/views/partials/`);

// Configure Express View Engine to Handlebars
app.set('view engine', 'hbs');

// Set Express to intercept all requests and Log to a File
app.use((req, res, next) => {

    const message = `${new Date()}: ${req.method} ${req.url} \n`;
    console.log(message);
    fs.appendFile('./logs/server.log', message, err => {
        console.error(err);
    } );

    next();
});

// // Set Express to show maintenance page
// app.use((req, res, next) => {
//
//     res.render('maintenance.hbs', {
//         pageTitle: 'Maintenance Page',
//         pageMessage: 'This site is under maintenance...\n Coming Back Soon...',
//     });
// });

// Set Express static resources (middleware)
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.render('index.hbs', {
        pageTitle: 'Home Page',
        pageMessage: 'landing page..',
    });
});


app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        pageMessage: 'about page..',
    });
});

app.get('/bad', (req, res) => {
    res.send({errorMessage: 'Requested resource not found!'});
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
