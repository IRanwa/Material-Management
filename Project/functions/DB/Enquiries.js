const ENQUIRY_DEFAULT = 0;
const that = this;
let FIRESTORE;
const schedule = require('node-schedule');

//Create new enquiry
exports.newEnquiry = function (req, res, db) {
    
    let data = req.body;
    let messages = {};
    //Check sending data enquiry data contains
    if (data !== null) {
        //Check sending enquiry order_id already exists
        db.collection("Enquiry").where("order_id", "==", data.order_id).limit(1).get()
            .then(docList => {
                
                data.status = data.order_status;
                data.place_date = data.order_placement_date;
                data.modify_date = new Date().toLocaleDateString();

                delete data["order_title"];
                delete data["order_details"];
                delete data["order_due_date"];
                delete data["order_status"];
                delete data["payment_status"];
                delete data["transaction_type"];
                delete data["order_placement_date"];
                delete data["order_price"];
                delete data["cancellation_penalty"];
                delete data["delivery_id"];
                delete data["customer_id"];

                if (docList.docs.length === 0) {
                    const callback = function (error, result, status) {
                        //If error return response
                        if (error) {
                            messages.enquiryMessage = result;
                            res.status(status).send(JSON.stringify({ message: messages }));
                        } else {
                            const id = result + 1;
                            data.enquiry_id = id;
                            db.collection("Enquiry").doc(id.toString()).set(data);
                            console.log("Enquiry added successfully");
                            messages.enquiryMessage = "Enquiry added successfully!";
                            res.status(200).send(JSON.stringify(messages));
                        }
                    }
                    that.getLastEnquiry(db, callback);
                } else {
                    //If order id already exists do below process
                    docList.forEach(doc => {
                        db.collection("Enquiry").doc(doc.data().enquiry_id.toString()).update(data);
                        console.log("Enquiry added successfully");
                        messages.enquiryMessage = "Enquiry added successfully!";
                        res.status(200).send(JSON.stringify(messages));
                    });
                }
                return null;
            }).catch(error => {
                console.log(error);
                console.log("Enquiry searching error!");
                messages.enquiryMessage = "Enquiry searching error!";
                res.status(500).send(JSON.stringify(messages));
            })
    } else {
        console.log("Empty fields found!");
        messages.enquiryMessage = "Empty fields found!";
        res.status(500).send(JSON.stringify(messages));
    }
};

//Find last enquiry and send back the enquiry id
exports.getLastEnquiry = function (db, callback) {
    db.collection("Enquiry").orderBy("enquiry_id", "desc").get()
    .then(docList => {
        if (docList.docs.length === 0) {
            return callback(false, ENQUIRY_DEFAULT, 200);
        } else {
            docList.forEach(doc => {
                return callback(false, doc.data().enquiry_id, 200);
            })
        }
        return null;
    }).catch(error => {
        console.log(error);
        console.log("Enquiry searching error!");
        return callback(true, "Enquiry searching error!", 500);
    })
};

//Get List of Enquiries
exports.getEnquiryList = function(req,res,db){
    db.collection("Enquiry").get()
    .then(docsList=>{
        let enquiries = [];
        docsList.forEach(doc=>{
            enquiries.push(doc.data());
        });
        res.status(200).send(JSON.stringify({enquiries}));
        return null;
    }).catch(error=>{
        console.log(error)
        res.status(500).send(JSON.stringify({message:"Enqiries search error!"}));
    });
};

//Get Specific enquiry
exports.getEnquiry = function(req,res,db){
    const enquiry_id = req.query.enquiry_id;
    db.collection("Enquiry").doc(enquiry_id).get()
    .then(docSnapshot=>{
        if(docSnapshot.data()===undefined){
            console.log("Enquiry not found!");
            res.status(404).send(JSON.stringify({message:"Enquiry not found!"}));
        }else{
            res.status(200).send(JSON.stringify(docSnapshot.data()));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Enquiry search error!"}));
    })
}

//Reserve stocks
exports.reserveStocks = function(req,res,db,firestore){
    FIRESTORE = firestore;
    const enquiry_id = req.query.enquiry_id;
    db.collection("Enquiry").doc(enquiry_id).get()
    .then(enqSnapshot=>{
        if(enqSnapshot.data()===undefined){
            console.log("Enquiry not found!");
            res.status(404).send(JSON.stringify({message:"Enquiry not found!"}));
        }else{
            const callback = function(error,result,status){
                console.log(status);
                if(error){
                    res.status(status).send(JSON.stringify({message:result}))
                }else{
                    const products = result.products;
                    let enquiryStatus = "Stocks Reserved";
                    products.forEach(prod=>{
                        if(!prod.status){
                            enquiryStatus = "Stocks Not Reserved";
                        }
                    });
                    result.status = enquiryStatus;
                    result.modify_date = new Date().toLocaleDateString();
                    db.collection("Enquiry").doc(enquiry_id).update(result);

                    scheduleStockReserve(db,result);
                    res.status(status).send(JSON.stringify({message:result}));
                }
            }
            enquiryProductsList(db,enqSnapshot.data(),callback,"Reserve");
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Enquiry search error!"}));
    });
}

//Emquiry each product reserve stocks
async function enquiryProductsList(db, data, callback,reserveStatus) {
    let products = data.products;
    let promises = [];
    products.forEach(async prod=>{
        const promise = new Promise(resolve=>{
            db.collection("Product").doc(prod.prodId.toString()).get()
            .then(async prodSnapshot=>{
                if(!prodSnapshot.exists){
                    console.log("Product details not found!");
                    return resolve([true, "Product details not found!", 404]);
                }else{
                    let product = prodSnapshot.data();
                    const prodCallback = function(results){
                        return resolve(results);
                    }
                    if(product.type==="Bicycle"){
                        if(reserveStatus==="Reserve" && !prod.status){
                            updateMaterialQty(db, product, prod,prodCallback,reserveStatus);
                        }
                        else if(reserveStatus==="ReStock" && prod.status){
                            updateMaterialQty(db, product, prod,prodCallback,reserveStatus);
                        }
                    }else{
                        if(reserveStatus==="Reserve" && !prod.status){
                            if(product.quantity>=prod.qty){
                                const decrement = FIRESTORE.FieldValue.increment(-prod.qty);
                                db.collection("Product").doc(prod.prodId.toString()).update({quantity:decrement});
                                prod.status = true;
                            }else{
                                prod.status = false;
                            }
                        }
                        else if(reserveStatus==="ReStock" && prod.status){
                            const increment = FIRESTORE.FieldValue.increment(prod.qty);
                            db.collection("Product").doc(prod.prodId.toString()).update({quantity:increment});
                            delete prod.status;
                        }
                        return resolve([false,prod,200]);
                    }
                    
                }
                return null;
            }).catch(error=>{
                console.log(error);
                return resolve([true, "Product details retrieve error!", 500]);
            });
        });
        promises.push(promise);
    });
    await Promise.all(promises).then(results=>{
        products.forEach(prod=>{
            results.forEach(result=>{
                const error = result[0];
                const info = result[1];
                const status = result[2];

                console.log("error ",error);
                console.log("info ",info);
                console.log("status ",status);
                if(error){
                    return callback(error,info,status);
                }else{
                    
                    if(info.product_id===prod.prodId){
                        prod = info;
                    }
                }
            })
        });
       
        data.products = products;
        return callback(false,data,200);
    })
}

//Reduce stocks from raw materials
async function updateMaterialQty(db,mainProduct,product,prodCallback,reserveStatus){
    let raw_materials = mainProduct.raw_material;
   let reserve_raw_materials = [];
    raw_materials.forEach(async raw_material=>{
        const docRef = db.collection("RawMaterials").doc(raw_material.id.toString());
        const transaction = db.runTransaction(T=>{
            return T.get(docRef)
            .then(doc=>{
                if(!doc.exists){
                    console.log("Reserve materials raw material details not Found!");
                     return [true,"Reserve materials raw material details not Found!",404];
                }else{
                    const totalQty = raw_material.quantity * product.qty;
                    if(reserveStatus==="Reserve"){
                        if(doc.data().quantity>=totalQty){
                            const decrement = FIRESTORE.FieldValue.increment(-totalQty);
                            T.update(docRef,{quantity:decrement});
                            product.status = true;
                            reserve_raw_materials.push({ id: raw_material.id, totalQty: totalQty });
                        }else{
                            product.status = false;
                            delete product.reserve_raw_materials;
                        }
                    }else{
                        const increment = FIRESTORE.FieldValue.increment(totalQty);
                        T.update(docRef,{quantity:increment});
                        delete product.status;
                        delete product.reserve_raw_materials;
                    }
                    return [false,product,200];
                }
            }).catch(error=>{
                console.log(error);
                return [true,"Reserve materials raw materials details retrieve error!",500];
            });
        });
        return prodCallback(
            await Promise.resolve(transaction).then(result=>{
                if(!result[0]){
                    console.log("reserve_raw_materials ",reserve_raw_materials)
                    product.reserve_raw_materials = reserve_raw_materials;
                    reserve_raw_materials = [];
                }
                return result;
            })
        );
    });
}

//Schedule stock reserve to restock back
function scheduleStockReserve(db,enquiry){
    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);
    console.log(date);
    if(enquiry.status==="Stocks Reserved" || enquiry.status==="Stocks Not Reserved"){
        const my_job = schedule.scheduledJobs[enquiry.enquiry_id.toString()];
        if(my_job!==undefined){
            my_job.cancel();
        }
        
        const job = schedule.scheduleJob(enquiry.enquiry_id.toString(),date, function(db,enquiry){
            db.collection("Enquiry").doc(enquiry.enquiry_id.toString()).get()
            .then(docSnapshot=>{
                console.log(docSnapshot);
                if(!docSnapshot.exists){
                    console.log("Enqiry not found in schedule job");
                }else{
                    console.log(docSnapshot.data().status);
                    if(docSnapshot.data().status==="Stocks Reserved" || docSnapshot.data().status==="Stocks Not Reserved"){
                        const callback = function(error,result,status){
                            console.log("restock result ",result);
                            if(error){
                                console.log(result);
                            }else{
                                result.status = "Enquiry Expired";
                                result.modify_date = new Date().toLocaleDateString();
                                db.collection("Enquiry").doc(enquiry.enquiry_id.toString()).update(result);
                            }
                        }
                        enquiryProductsList(db,docSnapshot.data(),callback,"ReStock");
                    }
                }
                return null;
            }).catch(error=>{
                console.log(error);
            })
        }.bind(null,db,enquiry));

        const m = schedule.scheduledJobs[enquiry.enquiry_id.toString()];
        console.log("end my_job ",m);
    }
}

//Update enquiry to order or cancelled
exports.updateEnquiry = function(req,res,db,firestore){
    FIRESTORE = firestore;
    const data = req.body;
    db.collection("Enquiry").where("order_id","==",data.order_id).get()
    .then(enquiryList=>{
        
        if(enquiryList.length===0){
            res.status(404).send(JSON.stringify({message:"Enquiry not found!"}));
        }else{
            enquiryList.forEach(enquiry=>{
                if(data.status==="Order" || data.status==="Production"){
                    db.collection("Enquiry").doc(enquiry.data().enquiry_id.toString()).update({status:"Order"});
                    res.status(200).send(JSON.stringify({message:"Enquiry updated successfully!"}));
                }else if(data.status==="Cancelled"){
                    const callback = function(error,result,status){
                        if(error){
                            res.status(status).send(JSON.stringify({message:result}));
                        }else{
                            db.collection("Enquiry").doc(enquiry.data().enquiry_id.toString()).update({status:"Cancelled"});
                            res.status(200).send(JSON.stringify({message:"Enquiry updated successfully!"}));
                        }
                    }
                    if(enquiry.data()!=="Production"){
                        enquiryProductsList(db,enquiry.data(),callback,"ReStock");
                    }
                }
            });
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Enquiry search error!"}));
    });
}
