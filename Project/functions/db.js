const Supplier = require("./DB/Supplier");
const RawMaterial = require("./DB/RawMaterial");
const Product = require("./DB/Product");


//Supplier DB [Start]
exports.regSupplier = function(req,res,db){
    Supplier.regSupplier(req,res,db);
}

exports.getSupplierList = function(req,res,db){
    Supplier.getSupplierList(req,res,db);
};

exports.getSupplier = function(req,res,db){
    Supplier.getSupplier(req,res,db);
}

exports.updateSupplier = function(req,res,db){
    Supplier.updateSupplier(req,res,db);
}

exports.deleteSupplier = function(req,res,db){
    Supplier.deleteSupplier(req,res,db);
}
//Supplier DB [End]

//Raw Materials DB [Start]
exports.newRawMaterial = function(req,res,db){
    RawMaterial.newRawMaterial(req,res,db);
}

exports.getRawMaterialList = function(req,res,db){
    RawMaterial.getRawMaterialList(req,res,db);
}

exports.getRawMaterial = function(req,res,db){
    RawMaterial.getRawMaterial(req,res,db);
}

exports.updateRawMaterial = function(req,res,db){
    RawMaterial.updateRawMaterial(req,res,db);
}

exports.deleteRawMaterial = function(req,res,db){
    RawMaterial.deleteRawMaterial(req,res,db);
}
//Raw Material DB [End]

//Product DB [Start]
exports.newProduct = function(req,res,db){
    Product.newProduct(req,res,db);
}

exports.getProductsList = function(req,res,db){
    Product.getProductsList(req,res,db);
}

exports.getProductDetails = function(req,res,db){
    Product.getProductDetails(req,res,db);
}

exports.updateProduct = function(req,res,db){
    Product.updateProduct(req,res,db);
}

exports.deleteProduct = function(req,res,db){
    Product.deleteProduct(req,res,db);
}
//Product DB [End]