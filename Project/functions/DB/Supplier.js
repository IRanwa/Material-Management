const LOGIN = require('./Login');
const SUPPLIER_DEFAULT = 0;

//Register Supplier
exports.regSupplier = function(req,res,db){
    let setData = req.body;
    const loginCallback = function(callback_error,results){
        if(callback_error===null){
            //Find last record
            db.collection("Suppliers").orderBy("supplierId","desc").limit(1).get()
            .then(docsList=>{
                //If no records found save with default id
                if(docsList.docs.length===0){
                    try{
                        const docRef = db.collection("Suppliers").doc(SUPPLIER_DEFAULT.toString());
                        setData.supplierId = SUPPLIER_DEFAULT;
                        docRef.set(setData);
                        console.log("Register Supplier -> New Supplier Saved!");
                        res.status(200).send(JSON.stringify({message:"New supplier saved successfully!"}));
                    }catch(error){
                        console.log(error)
                        console.log("Register Supplier -> New Supplier Save Un-Successful!");
                        res.status(500).send(JSON.stringify({message:"Saving new supplier un-successful!"}));
                    }
                }else{
                    //Go through first record and generate new id and save
                    docsList.forEach(doc=>{
                        const newSupplierId = doc.data().supplierId+1;
                        console.log("Register Supplier -> New Supplier Id Generated!");
                        try{
                            const docRef = db.collection("Suppliers").doc(newSupplierId.toString());
                            setData.supplierId = newSupplierId;
                            docRef.set(setData);
                            console.log("Register Supplier -> New Supplier Saved!");
                            res.status(200).send(JSON.stringify({message:"New supplier saved successfully!"}));
                        }catch(error){
                            console.log(error)
                            console.log("Saving new supplier un-successful!");
                            res.status(500).send(JSON.stringify({message:"Saving new supplier un-successful!"}));
                        }
                    });
                }
                return null;
            }).catch(error=>{
                console.log(error);
                console.log("Register Supplier -> Searching last supplier record error!");
                res.status(500).send(JSON.stringify({message:"Searching last supplier record error!"}));
            });
        }
    }
    LOGIN.regLogin(res,setData,db,loginCallback);
};

//Get Supplier List
exports.getSupplierList = function(req,res,db){
    db.collection("Suppliers")
    .orderBy("supplierId", "asc").get()
    .then(docList=>{
        let suppliers = [];
        docList.forEach(doc=>{
            suppliers.push(doc.data());
        });
        res.status(200).send(JSON.stringify({suppliers}));
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Get Supplier List Un-Successful!"}));
    });
}

//Get Specific Supplier
exports.getSupplier = function(req,res,db){
    let query = req.query;
    console.log(query);
    console.log("suplier id : ",query.supplierId);
    const supplierId = parseInt(query.supplierId);
    console.log("suplier id : ",supplierId);
    console.log(typeof supplierId);
    db.collection("Suppliers").where("supplierId","==",supplierId).get()
    .then(docList=>{
        if(docList.docs.length!==0){
            docList.forEach(doc=>{
                let data = doc.data();
                let stockItems = data.stockItems;
                let count=0;
                stockItems.forEach(async item=>{
                    count++;
                    if(item.type==="Raw Material"){
                        const docRef = db.collection("RawMaterials").doc(item.raw_material_id.toString());
                        const transaction = db.runTransaction(T=>{
                            return T.get(docRef)
                            .then(docSnapshot=>{
                                if(!docSnapshot.exists){
                                    console.log("Raw material not found!");
                                    return null;
                                }else{
                                    return docSnapshot.data();
                                }
                            }).catch(error=>{
                                console.log(error);
                                console.log("Raw material search error!");
                            })
                        });
                        await Promise.resolve(transaction).then(result=>{
                            if(result!==null){
                                item.name = result.name;
                            }
                            return null;
                        });
                    }else{
                        const docRef = db.collection("Product").doc(item.product_id.toString());
                        const transaction = db.runTransaction(T=>{
                            return T.get(docRef)
                            .then(docSnapshot=>{
                                if(!docSnapshot.exists){
                                    console.log("Product not found!");
                                    return null;
                                }else{
                                    return docSnapshot.data();
                                }
                            }).catch(error=>{
                                console.log(error);
                                console.log("Product search error!");
                            })
                        });
                        await Promise.resolve(transaction).then(result=>{
                            if(result!==null){
                                item.name = result.name;
                            }
                            return null;
                        });
                    }
                    count--;
                    if(count===0){
                        res.status(200).send(JSON.stringify(data));
                    }
                });
                
                
            })
        }else{
            console.log("Supplier details not found!");
            res.status(404).send(JSON.stringify({message:"Supplier details not found!"}));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Supplier details search error!");
        res.status(500).send(JSON.stringify({message:"Supplier details search error!"}));
    });
}

//Update Specific Supplier
exports.updateSupplier = function(req,res,db){
    const query = req.query;
    db.collection("Suppliers").doc(query.supplierId).get()
    .then(docList=>{   
        return docList;
    }).then(doc=>{
        if(doc.data()!==undefined){
            const data = req.body;
            delete data["userRole"];
            db.collection("Suppliers").doc(query.supplierId).set(req.body);
            res.status(200).send(JSON.stringify({message:"Supplier updated successfully!!"}));
        }else{
            console.log("Supplier update un-successful!");
            res.status(404).send(JSON.stringify({message:"Supplier update un-successful!"}));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Searching supplier error!"}));
    });
}

//Delete Specific Supplier
exports.deleteSupplier = function(req,res,db){
    const query = req.query;
    db.collection("Suppliers").doc(query.supplierId).get()
    .then(docList=>{
        return docList;
    }).then(doc=>{
        if(doc.data()===null){
            console.log("Supplier delete un-successful!");
            res.status(500).send(JSON.stringify({message:"Supplier delete un-successful!"}));
        }else{
            db.collection("Suppliers").doc(query.supplierId).delete();
            console.log("Supplier delete successful!");
            res.status(200).send(JSON.stringify({message:"Supplier delete successful!"}));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Supplier details searching error!"}));
    })
}

//Add Stock Item
exports.addStockItem = function(req,res,db){
    const supplierId = req.query.supplierId;
    db.collection("Suppliers").doc(supplierId.toString()).get()
    .then(docSnapshot=>{
        console.log(docSnapshot);
        console.log(supplierId);
        if(!docSnapshot.exists){
            console.log("Supplier not found!");
            res.status(404).send(JSON.stringify({message:"Supplier not found!"}));
        }else{
            const stock_item = req.body;
            let data = docSnapshot.data();
            let stockItems = data.stockItems;
            if(stockItems===undefined){
                db.collection("Suppliers").doc(supplierId.toString()).update({stockItems:[stock_item]});
                res.status(200).send(JSON.stringify({message:"Supplier stock item added successfully!"}));
            }else{
                let available = false;
                stockItems.forEach(item=>{
                    if(item.type==="Raw Material"){
                        if(item.raw_material_id===stock_item.raw_material_id){
                            available = true;
                        }
                    }else{
                        if(item.product_id===stock_item.product_id){
                            available = true;
                        }
                    }
                });

                if(!available){
                    stockItems.push(stock_item);
                    db.collection("Suppliers").doc(supplierId.toString()).update({stockItems:stockItems});
                    res.status(200).send(JSON.stringify({message:"Supplier stock item added successfully!"}));
                }else{
                    res.status(500).send(JSON.stringify({message:"Supplier stock item already exists!"}));
                }
            }
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Supplier search error!"}));
    })
}
