const REQUISITION_ID = 1;

exports.newRequisition = function(req,res,db){
    db.collection("Requisition").orderBy("requisition_id","desc").limit(1).get()
    .then(docList=>{
        let data = req.body;
        data.place_date = new Date().toLocaleString();
        data.status = "Pending";
        if(docList.docs.length===0){
            data.requisition_id = REQUISITION_ID;
            db.collection("Requisition").doc(REQUISITION_ID.toString()).set(data);
            res.status(200).send(JSON.stringify({message:"Purhcase reqisition saved successfully!"}));
        }else{
            docList.forEach(doc=>{
                let id = doc.data().requisition_id+1;
                data.requisition_id = id;
                db.collection("Requisition").doc(id.toString()).set(data);
                res.status(200).send(JSON.stringify({message:"Purhcase reqisition saved successfully!"}));
            });
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Purchase requisition searching error!"}));
    });
}

exports.getRequisitionsList = function(req,res,db){
    db.collection("Requisition").get()
    .then(async docsList=>{
        let requisitions = [];
        let documentPromises = [];
        docsList.forEach(async doc=>{
            const documentPromise = new Promise(async documentResolve=>{
                let requisition = doc.data();
                let promises = [];
                requisition.requisitionItems.forEach(item=>{
                    const promise = new Promise(resolve=>{
                        const callback = function(result){
                            item.stockItem = result;
                            return resolve(item);
                        }
                        if(item.type==="Raw Material"){
                            getRawMaterialName(item,db,callback);
                        }else{
                            getProductName(item,db,callback);
                        }
                    });
                    promises.push(promise);
                });
                
                await Promise.all(promises)
                .then(results=>{
                    let requisitionItems = [];
                    results.forEach(result=>{
                        requisitionItems.push(result);
                    })
                    console.log(requisition);
                    console.log(requisitionItems);
                    console.log(requisitionItems[0].stockItem);
                    requisitions.push(requisition);
                    return documentResolve(null);
                });
            });
            documentPromises.push(documentPromise);
        });

        await Promise.all(documentPromises)
        .then(results=>{
            res.status(200).send(JSON.stringify({requisitions}));
            return null;
        });

        
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Purchase requisitions searching error!"}));
    })
}

exports.getRequisition = function(req,res,db){
    const id = req.query.id;
    db.collection("Requisition").doc(id).get()
    .then(async docSnapshot=>{
        if(!docSnapshot.exists){
            console.log("Requisition not found!");
            res.status(404).send(JSON.stringify({message:"Requisition not found!"}));
        }else{
            let requisition = docSnapshot.data();
            let promises = [];
            requisition.requisitionItems.forEach(item=>{
                const promise = new Promise(resolve=>{
                    const callback = function(result){
                        item.stockItem = result;
                        return resolve(item);
                    }
                    if(item.type==="Raw Material"){
                        getRawMaterialName(item,db,callback);
                    }else{
                        getProductName(item,db,callback);
                    }
                });
                promises.push(promise);
            });
            
            await Promise.all(promises)
            .then(results=>{
                let requisitionItems = [];
                results.forEach(result=>{
                    requisitionItems.push(result);
                })
                console.log(requisition);
                console.log(requisitionItems);
                console.log(requisitionItems[0].stockItem);
                res.status(200).send(JSON.stringify(requisition));
                return null;
            });
            
            
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Purchase requisitions searching error!"}));
    })
}

async function getRawMaterialName(item,db,callback){
    const docRef = db.collection("RawMaterials").doc(item.raw_material_id.toString());
    const transaction = db.runTransaction(T=>{
        return T.get(docRef)
        .then(docSnapshot=>{
            if(docSnapshot.exists){
                return docSnapshot.data();
            }
            return null;
        }).catch(error=>{
            console.log(error);
            return null;
        });
    });

    return callback(await Promise.resolve(transaction).then(result=>{
        return result;
    }));
}

async function getProductName(item,db,callback){
    const docRef =  db.collection("Product").doc(item.product_id.toString());
    const transaction = db.runTransaction(T=>{
        return T.get(docRef)
        .then(docSnapshot=>{
            if(docSnapshot.exists){
                return docSnapshot.data();
            }
            return null;
        }).catch(error=>{
            console.log(error);
            return null;
        });
    });

    return callback(await Promise.resolve(transaction).then(result=>{
        return result;
    }));

}