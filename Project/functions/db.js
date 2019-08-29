const Supplier = require("./DB/Supplier");


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