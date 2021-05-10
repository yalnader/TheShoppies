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

    // ref.once("value", function(snapshot) {
    //     console.log(snapshot.val());
    //     let data = snapshot.val();
    //     // res.send(data);
    //     if(data !== undefined){
    //         if(data[refKey] !== undefined){
    //             let obj = {
    //                 name: data[refKey].name,
    //                 nominations: data[refKey].nominations
    //             }
    //             res.render('index', {data: obj});
    //         }
    //     }
    //   });

    // ref.child(refKey).get().then((snapshot) => {
    //     if(snapshot.exists()){
    //         let data = snapshot.val();
    //         // res.send(data);
    //         let obj = {
    //             name: data.name,
    //             nominations: data.nominations
    //         }
    //         res.render('index', {data: obj});
    //     } else {
    //         console.log("No data available");
    //     }
    // }).catch((error) => {
    //     console.log(error)
    // });

    // ref.equalTo(refKey).on('value', function(snapshot){
    //     let data = snapshot.val();
    //     res.send(data);
    //         let obj = {
    //             name: data.name,
    //             nominations: data.nominations
    //         }
    //         // res.render('index', {data: obj});

    // }, function(errorObject) {
    //     console.log(errorObject.message);
    // })
    

    // ref.on('value',function(snapshot){
    //     let data = snapshot.val();
    //     // res.send(data);
    //     if(data !== undefined){
    //         if(data[refKey] !== undefined){
    //             let obj = {
    //                 name: data[refKey].name,
    //                 nominations: data[refKey].nominations
    //             }
    //             res.render('index', {data: obj});
    //         }
    //     }else{
    //         res.send("There was an error reading from the Database");
    //     }
    // }, function(errorObject) {
    //     console.log(errorObject.message);
    // });
    

 
    //get data from db
    //and render ejs file here
    // res.send(refKey);
});

exports.app = functions.https.onRequest(app);
