const RAW_MATERIAL_DEFAULT = 0;
const that = this;

//New Raw Material
exports.newRawMaterial = function(req,res,db){
    //Get Last Saved Raw Material
    db.collection("RawMaterials").orderBy("raw_material_id","desc").limit(1).get()
    .then(docList=>{
        const data = req.body;
        //If no raw materials saved, save with default id
        if(docList.docs.length===0){
            data.raw_material_id = RAW_MATERIAL_DEFAULT;
            db.collection("RawMaterials").doc(RAW_MATERIAL_DEFAULT.toString()).set(data);
            console.log("Raw Material Saved Successfully!");
            res.status(200).send(JSON.stringify({message:"Raw Material Saved Successfully!"}));
        }else{
            //Generate new raw material id and save
            docList.forEach(doc=>{
                data.raw_material_id = doc.data().raw_material_id+1;
                db.collection("RawMaterials").doc(data.raw_material_id.toString()).set(data);
                console.log("Raw Material Saved Successfully!");
                res.status(200).send(JSON.stringify({message:"Raw Material Saved Successfully!"}));
            })
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Raw Material Search Error!");
        res.status(500).send(JSON.stringify({message:"Raw Material Search Error!"}));
    })
};

//Get Raw Material List
exports.getRawMaterialList = function(req,res,db){
    db.collection("RawMaterials").get()
    .then(docList=>{
        //All raw material details insert to a array and return
        let rawmaterials = [];
        docList.forEach(doc=>{
            rawmaterials.push(doc.data());
        })
        console.log("Raw Materials List Retrieve Successful!");
        res.status(200).send(JSON.stringify({rawmaterials}));
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"Raw materials data retrieve error!"}));
    })
}

//Get Specific Raw Material
exports.getRawMaterial = function(req,res,db){
    const callback = function(error,result,status){
        if(error){
            res.status(status).send(JSON.stringify({message:result}));
        }else{
            res.status(status).send(JSON.stringify(result));
        }
    }
    that.getRawMaterialDetails(req,res,db,callback);

    // const query = req.query;
    // db.collection("Raw Materials").doc(query.raw_material_id).get()
    // .then(docSnapshot=>{
    //     //If data undefined it means document not found or else return information
    //     if(docSnapshot.data()===undefined){
    //         console.log("Raw material not found!");
            
    //     }else{
    //         console.log("Raw material search successful!");
    //         res.status(200).send(JSON.stringify(docSnapshot.data()));
    //     }
    //     return null;
    // }).catch(error=>{
    //     console.log(error);
    //     console.log("Raw material search error!");
    //     res.status(500).send(JSON.stringify({message:"Raw material search error!"}));
    // })
}

//Update Raw Material
exports.updateRawMaterial = function(req,res,db){
    const query = req.query;
    db.collection("RawMaterials").doc(query.raw_material_id).get()
    .then(docSnapshot=>{
        if(docSnapshot.data()===undefined){
            console.log("Raw material not found!");
            res.status(404).send(JSON.stringify({message:"Raw material not found!"}));
        }else{
            let data = req.body;
            data.raw_material_id = docSnapshot.data().raw_material_id;
            db.collection("RawMaterials").doc(query.raw_material_id).update(data);
            console.log("Raw material updated successfully!");
            res.status(200).send(JSON.stringify({message:"Raw material updated successfully!"}));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Raw material searching error!");
        res.status(500).send(JSON.stringify({message:"Raw material searching error!"}));
    })
}

//Delete Raw Material
exports.deleteRawMaterial = function(req,res,db){
    const query = req.query;
    db.collection("RawMaterials").doc(query.raw_material_id).get()
    .then(docSnapshot=>{
        if(docSnapshot.data()===undefined){
            console.log("Raw material not found!");
            res.status(404).send(JSON.stringify({message:"Raw material not found!"}));
        }else{
            db.collection("RawMaterials").doc(query.raw_material_id).delete();
            console.log("Raw material delete successful!");
            res.status(200).send(JSON.stringify({message:"Raw material delete successful!"}));
        }
        return null;
    }).catch(error=>{
        console.log(error);
        console.log("Raw material search error!");
        res.status(500).send(JSON.stringify({message:"Raw material search error!"}));
    })
}

exports.getRawMaterialDetails = function(req,res,db,callback){
    const query = req.query;
    return new Promise(resolve=>{
        setTimeout(resolve,1000);
        db.collection("RawMaterials").doc(query.raw_material_id).get()
        .then(docSnapshot=>{
            //If data undefined it means document not found or else return information
            if(docSnapshot.data()===undefined){
                console.log("Raw material not found!");
                return callback(true,"Raw material not found!",404);
            }else{
                console.log("Raw material search successful!");
                return callback(false,docSnapshot.data(),200);
            }
        }).catch(error=>{
            console.log(error);
            console.log("Raw material search error!");
            return callback(true,"Raw material search error!",500);
        });
    });
}