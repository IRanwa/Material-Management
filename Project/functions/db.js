const Supplier = require("./DB/Supplier");
const RawMaterial = require("./DB/RawMaterial");


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
//Raw Material DB [End]