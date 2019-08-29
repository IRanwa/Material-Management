const functions = require('firebase-functions');

const express = require('express');
const cors = require('cors');
const app = express();

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


const DB = require('./db');
const jwt = require('./jwt');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.get('/getSupplierList',(req,res)=>{
    DB.getSupplierList(req,res,db);
});

app.get('/getSupplier',(req,res)=>{
    DB.getSupplier(req,res,db);
});

app.post('/registerSupplier',(req,res)=>{
    DB.regSupplier(req,res,db);
});

app.put('/updateSupplier',(req,res)=>{
    DB.updateSupplier(req,res,db);
});

exports.supplier = functions.https.onRequest(app);

// exports.registerSupplier = functions.https.onRequest((req,res)=>{
//     db.registerSupplier(req,res);
// });

// exports.viewAllSuppliers = functions.https.onRequest((req,res)=>{
//     db.viewAllSuppliers(req,res);
// });

// exports.userLogin = functions.https.onRequest((req,res)=>{
//     jwt.generateToken(req,res);
// });