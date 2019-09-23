const PRODUCT_DEFAULT = 1;
const RawMaterial = require("./RawMaterial");
const that = this;

//Add new product
exports.newProduct = function(req,res,db){
    console.log(req.body);
    console.log("new product start");
    db.collection("Product").orderBy("product_id","desc").limit(1).get()
    .then(docList=>{
        let data = req.body;
        if(docList.docs.length===0){
            data.product_id = PRODUCT_DEFAULT;
            db.collection("Product").doc(PRODUCT_DEFAULT.toString()).set(data);
            console.log("Product added successfully!");
            res.status(200).send(JSON.stringify({message:"Product added successfully!"}));
        }else{
            docList.forEach(doc=>{
                const id = doc.data().product_id+1
                data.product_id = id;
                db.collection("Product").doc(id.toString()).set(data);
                console.log("Product added successfully");
                res.status(200).send(JSON.stringify({message:"Product added successfully!"}));
            });
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Product searching error!");
        res.status(500).send(JSON.stringify({message:"Product searching error!"}));
    })
};

//Get List of Products
exports.getProductsList = function(req,res,db){
    db.collection("Product").get()
    .then(docList=>{
        let products = [];
        var x = 0;
        docList.forEach(doc=>{
            let data = doc.data();
            let raw_materials = data.raw_material;
            const callback = function(error,result){
                x--;
                console.log(error);
                console.log(result);
                if(!error){
                    data.raw_material = result;
                    products.push(data);
                    if(x===0){
                        res.status(200).send(JSON.stringify({products}));
                    }
                }else{
                    if(x===0){
                        res.status(500).send(JSON.stringify({message:"Products list raw material name retrieve error!"}));
                    }
                }
            }
            x++;
            that.getRawMaterialName(raw_materials,req,res,db,callback);
        });
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Products retrieving error!");
        res.status(500).send(JSON.stringify({message:"Products retrieving error!"}));
    })
};

//Product raw materials list names retrieve
exports.getRawMaterialName = function(raw_materials,req,res,db,returnData){
    var x = 0;
    raw_materials.forEach(raw_material=>{
        req.query.raw_material_id = raw_material.id.toString();
        const callback = function(error,result){
            x--;
            if(!error){
                raw_material.name = result.name;
                if(x===0){
                    return returnData(false,raw_materials);
                }
            }else{
                if(x===0){
                    return returnData(true,null);
                }
            }
            return null;
        };
        x++;
        RawMaterial.getRawMaterialDetails(req,res,db,callback);
    });
};

//Get specific product
exports.getProductDetails = function(req,res,db){
    const query = req.query;
    db.collection("Product").doc(query.product_id).get()
    .then(docSnapshot=>{
        if(docSnapshot.data()===undefined){
            console.log("Product details not found!");
            res.status(404).send(JSON.stringify({message:"Product details not found!"}));
        }else{
            let product = docSnapshot.data();
            let raw_materials = product.raw_material;
            const callback = function(error,result){
                if(error){
                    console.log("Product details raw material name retrieve error!");
                    res.status(500).send(JSON.stringify({message:"Product details raw material name retrieve error!"}));
                }else{
                    product.raw_material = result;
                    console.log("Product details retrieve successful!");
                    res.status(200).send(JSON.stringify(product));
                }
            }
            that.getRawMaterialName(raw_materials,req,res,db,callback);
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Product details search error!");
        res.status(500).send(JSON.stringify({message:"Product details search error!"}));
    })
};

//Update specific product
exports.updateProduct = function(req,res,db){
    const query = req.query;
    db.collection("Product").doc(query.product_id).get()
    .then(docSnapshot=>{
        if(docSnapshot.data()===undefined){
            console.log("Product details not found!");
            res.status(404).send(JSON.stringify({message:"Product details not found!"}));
        }else{
            db.collection("Product").doc(query.product_id).update(req.body);
            console.log("Product details updated successfully!");
            res.status(200).send(JSON.stringify({message:"Product details updated successfully!"}));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Product details search error!");
        res.status(500).send(JSON.stringify({message:"Product details search error!"}));
    })
};

//Delete specific product
exports.deleteProduct = function(req,res,db){
    const query = req.query;
    db.collection("Product").doc(query.product_id).get()
    .then(docSnapshot=>{
        if(docSnapshot.data()===undefined){
            console.log("Product details not found!");
            res.status(404).send(JSON.stringify({message:"Product details not found!"}));
        }else{
            db.collection("Product").doc(query.product_id).delete();
            console.log("Product deleted successfully!");
            res.status(200).send(JSON.stringify({message:"Product deleted successfully!"}));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Product details search error!");
        res.status(500).send(JSON.stringify({message:"Product details search error!"}));
    })
};

exports.getStockAccessoriesList = function(req,res,db){
    db.collection("Product").where("type","==","Stock Accessory").get()
    .then(docsList=>{
        let products = [];
        docsList.forEach(doc=>{
            products.push(doc.data());
        });
        res.status(200).send(JSON.stringify({products}));
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Products search error!"}));
    });
}


