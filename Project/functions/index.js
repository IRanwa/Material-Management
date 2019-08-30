const functions = require('firebase-functions');
const DB = require('./db');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

const express = require('express');
const cors = require('cors');

const supplier = express();
const rawmaterials = express();

// Automatically allow cross-origin requests
supplier.use(cors({ origin: true }));
rawmaterials.use(cors({origin:true}));


//Supplier APIs
supplier.get('/getSupplierList',(req,res)=>{
    DB.getSupplierList(req,res,db);
});

supplier.get('/getSupplier',(req,res)=>{
    DB.getSupplier(req,res,db);
});

supplier.post('/registerSupplier',(req,res)=>{
    DB.regSupplier(req,res,db);
});

supplier.put('/updateSupplier',(req,res)=>{
    DB.updateSupplier(req,res,db);
});

supplier.delete('/deleteSupplier',(req,res)=>{
    DB.deleteSupplier(req,res,db);
});

//Raw Material APIs
rawmaterials.post('/newRawMaterial',(req,res)=>{
    DB.newRawMaterial(req,res,db);
});

rawmaterials.get('/getRawMaterialList',(req,res)=>{
    DB.getRawMaterialList(req,res,db);
});

exports.supplier = functions.https.onRequest(supplier);
exports.rawmaterials = functions.https.onRequest(rawmaterials);

// exports.registerSupplier = functions.https.onRequest((req,res)=>{
//     db.registerSupplier(req,res);
// });

// exports.viewAllSuppliers = functions.https.onRequest((req,res)=>{
//     db.viewAllSuppliers(req,res);
// });

// exports.userLogin = functions.https.onRequest((req,res)=>{
//     jwt.generateToken(req,res);
// });