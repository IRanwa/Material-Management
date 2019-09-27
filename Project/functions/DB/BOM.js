const BOM_ID = 1;

exports.newBOM = function(req,res,db){
    db.collection("BOM").orderBy("bom_id","desc").limit(1).get()
    .then(docsList=>{
        let data = req.body;
        data.place_date = new Date().toLocaleString();
        if(docsList.docs.length===0){
            console.log("not found ")
            data.bom_id = BOM_ID;
            db.collection("BOM").doc(BOM_ID.toString()).set(data);
            res.status(200).send(JSON.stringify({message:"BOM saved successfully!"}));
        }else{
            console.log("found ")
            docsList.forEach(doc=>{
                const id = doc.data().bom_id + 1;
                data.bom_id = id;
                db.collection("BOM").doc(id.toString()).set(data);
                res.status(200).send(JSON.stringify({message:"BOM saved successfully!"}));
            });
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"BOM searching error!"}));
    })
}

exports.getBOMList = function(req,res,db){
    db.collection("BOM").get()
    .then(async docsList=>{
        
        let promises = [];
        docsList.forEach( doc=>{
            const bom = doc.data();
            const promise = new Promise(async resolve=>{
                let billPromises = [];
                console.log("bom.billItems ",bom.billItems)
                bom.billItems.forEach(billItem=>{
                    const billPromise = new Promise(billResolve=>{
                        if(billItem.prodId!==undefined){
                            db.collection("Product").doc(billItem.prodId.toString()).get()
                            .then(prodSnapshot=>{
                                if(prodSnapshot.exists){
                                    billItem.raw_material = prodSnapshot.data().raw_material;
                                    console.log("start ",billItem)
                                }
                                console.log(prodSnapshot.data())
                                console.log(prodSnapshot.exists)
                                console.log("end ",billItem)
                                return billResolve(billItem);
                            }).catch(error=>{
                                console.log(error);
                                console.log("Product searching error!");
                                return billResolve(billItem);
                            })
                        }else{
                            return billResolve(billItem);
                        }
                    });
                    billPromises.push(billPromise);
                });
                return resolve(
                    await Promise.all(billPromises)
                    .then(results=>{
                        let billItems = [];
                        results.forEach(result=>{
                            billItems.push(result);
                        });
                        bom.billItems = billItems;
                        return bom;
                    })
                );
            });
            promises.push(promise);
        });
        await Promise.all(promises).then(results=>{
            let boms = [];
            results.forEach(result=>{
                boms.push(result);
            });
            res.status(200).send(JSON.stringify({boms}));
            return null;
        })
        
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"BOM searching error!"}));
    });
}

exports.getBOM = function(req,res,db){
    const id = req.query.id;
    db.collection(BOM).doc(id).get()
    .then(docSnapshot=>{
        if(!docSnapshot.exists){
            console.log("BOM details not found!");
            res.status(404).sedn(JSON.stringify({message:"BOM details not found!"}));
        }else{
            res.status(200).send(JSON.stringify(docSnapshot.data()));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"BOM searching error!"}));
    })
}