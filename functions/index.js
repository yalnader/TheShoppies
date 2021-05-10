const functions = require("firebase-functions");
const express = require('express');
const admin = require("firebase-admin");
const engines = require('consolidate');

const firebaseApp = admin.initializeApp(functions.config().firebase);

// Get a database reference to our posts

const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set("view engine", "hbs");


app.use(express.static('public'));

function getData(){
    const ref = firebaseApp.database().ref('nominationTree');
    return ref.once('value').then((snap) => snap.val());
}

app.get('/nominations/:id', (req, res) => {
    const refKey = req.params.id;

    getData().then((data) => {
        let obj = {
            name: data[refKey].name,
            nominations: data[refKey].nominations
        }
        res.render('index', {obj});
    });

});

exports.app = functions.https.onRequest(app);
