const functions = require('firebase-functions');
const DB = require('./db');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
let firestore = admin.firestore;

const express = require('express');
const cors = require('cors');

const supplier = express();
const rawmaterials = express();
const product = express();
const enquiry = express();

// Automatically allow cross-origin requests
supplier.use(cors({ origin: true }));
rawmaterials.use(cors({origin:true}));
product.use(cors({origin:true}));
enquiry.use(cors({origin:true}));


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

rawmaterials.get('/getRawMaterial',(req,res)=>{
    DB.getRawMaterial(req,res,db);
});

rawmaterials.put('/updateRawMaterial',(req,res)=>{
    DB.updateRawMaterial(req,res,db);
});

rawmaterials.delete('/deleteRawMaterial',(req,res)=>{
    DB.deleteRawMaterial(req,res,db);
});

//Product APIs
product.post('/newProduct',(req,res)=>{
    DB.newProduct(req,res,db);
});

product.get('/getProductsList',(req,res)=>{
    DB.getProductsList(req,res,db);
});

product.get('/getProductDetails',(req,res)=>{
    DB.getProductDetails(req,res,db);
});

product.put('/updateProduct',(req,res)=>{
    DB.updateProduct(req,res,db);
});

product.delete('/deleteProduct',(req,res)=>{
    DB.deleteProduct(req,res,db);
});

//Enquiry APIs
enquiry.post('/newEnquiry',(req,res)=>{
    DB.newEnquiry(req,res,db);
})

enquiry.get('/getEnquiryList',(req,res)=>{
    DB.getEnquiryList(req,res,db);
});

enquiry.get('/getEnquiry',(req,res)=>{
    DB.getEnquiry(req,res,db);
});

enquiry.get('/reserveStocks',(req,res)=>{
    DB.reserveStocks(req,res,db,firestore);
});

exports.supplier = functions.https.onRequest(supplier);
exports.rawmaterials = functions.https.onRequest(rawmaterials);
exports.product = functions.https.onRequest(product);
exports.enquiry = functions.https.onRequest(enquiry);