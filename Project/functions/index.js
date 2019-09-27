const functions = require('firebase-functions');
const Middleware = require('./middleware');
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
const requisition = express();
const bom = express();
const grn = express();

// Automatically allow cross-origin requests
supplier.use(cors({ origin: true }));
rawmaterials.use(cors({origin:true}));
product.use(cors({origin:true}));
enquiry.use(cors({origin:true}));
requisition.use(cors({origin:true}));
bom.use(cors({origin:true}));
grn.use(cors({origin:true}));


//Supplier APIs
supplier.get('/getSupplierList',(req,res)=>{
    Middleware.getSupplierList(req,res,db);
});

supplier.get('/getSupplier',(req,res)=>{
    Middleware.getSupplier(req,res,db);
});

supplier.post('/registerSupplier',(req,res)=>{
    Middleware.regSupplier(req,res,db);
});

supplier.put('/updateSupplier',(req,res)=>{
    Middleware.updateSupplier(req,res,db);
});

supplier.delete('/deleteSupplier',(req,res)=>{
    Middleware.deleteSupplier(req,res,db);
});

supplier.post('/addStockItem',(req,res)=>{
    Middleware.addStockItem(req,res,db);
});

supplier.get("/getSupplierByStockItem",(req,res)=>{
    Middleware.getSupplierByStockItem(req,res,db);
})
//Raw Material APIs
rawmaterials.post('/newRawMaterial',(req,res)=>{
    Middleware.newRawMaterial(req,res,db);
});

rawmaterials.get('/getRawMaterialList',(req,res)=>{
    Middleware.getRawMaterialList(req,res,db);
});

rawmaterials.get('/getRawMaterial',(req,res)=>{
    Middleware.getRawMaterial(req,res,db);
});

rawmaterials.put('/updateRawMaterial',(req,res)=>{
    Middleware.updateRawMaterial(req,res,db);
});

rawmaterials.delete('/deleteRawMaterial',(req,res)=>{
    Middleware.deleteRawMaterial(req,res,db);
});

rawmaterials.get('/getLowStockMaterials',(req,res)=>{
    Middleware.getLowStockMaterials(req,res,db);
});

//Product APIs
product.post('/newProduct',(req,res)=>{
    Middleware.newProduct(req,res,db);
});

product.get('/getProductsList',(req,res)=>{
    Middleware.getProductsList(req,res,db);
});

product.get('/getProductDetails',(req,res)=>{
    Middleware.getProductDetails(req,res,db);
});

product.put('/updateProduct',(req,res)=>{
    Middleware.updateProduct(req,res,db);
});

product.delete('/deleteProduct',(req,res)=>{
    Middleware.deleteProduct(req,res,db);
});

product.get('/getStockAccessoriesList',(req,res)=>{
    Middleware.getStockAccessoriesList(req,res,db);
});

//Enquiry APIs
enquiry.post('/newEnquiry',(req,res)=>{
    Middleware.newEnquiry(req,res,db);
})

enquiry.get('/getEnquiryList',(req,res)=>{
    Middleware.getEnquiryList(req,res,db);
});

enquiry.get('/getEnquiry',(req,res)=>{
    Middleware.getEnquiry(req,res,db);
});

enquiry.get('/reserveStocks',(req,res)=>{
    Middleware.reserveStocks(req,res,db,firestore);
});

enquiry.put('/updateEnquiry',(req,res)=>{
    Middleware.updateEnquiry(req,res,db,firestore);
});

//Purchase Requisition
requisition.post('/newRequisition',(req,res)=>{
    Middleware.newRequisition(req,res,db);
});

requisition.get('/getRequisitionsList',(req,res)=>{
    Middleware.getRequisitionsList(req,res,db);
});

requisition.get('/getRequisition',(req,res)=>{
    Middleware.getRequisition(req,res,db);
});

//BOM
bom.post('/newBOM',(req,res)=>{
    Middleware.newBOM(req,res,db);
});

bom.get('/getBOMList',(req,res)=>{
    Middleware.getBOMList(req,res,db);
});

bom.get('/getBOM',(req,res)=>{
    Middleware.getBOM(req,res,db);
});

//GRN
grn.post('/newGRN',(req,res)=>{
    Middleware.newGRN(req,res,db);
});

grn.get('/getGRNList',(req,res)=>{
    Middleware.getGRNList(req,res,db);
});


exports.supplier = functions.https.onRequest(supplier);
exports.rawmaterials = functions.https.onRequest(rawmaterials);
exports.product = functions.https.onRequest(product);
exports.enquiry = functions.https.onRequest(enquiry);
exports.requisition = functions.https.onRequest(requisition);
exports.bom = functions.https.onRequest(bom);
exports.grn = functions.https.onRequest(grn);