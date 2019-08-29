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
                res.status(200).send(JSON.stringify(doc.data()));
                
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

