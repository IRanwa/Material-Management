const RAW_MATERIAL_DEFAULT = 0;

//New Raw Material
exports.newRawMaterial = function(req,res,db){
    //Get Last Saved Raw Material
    db.collection("Raw Materials").orderBy("raw_material_id","desc").limit(1).get()
    .then(docList=>{
        const data = req.body;
        //If no raw materials saved, save with default id
        if(docList.docs.length===0){
            data.raw_material_id = RAW_MATERIAL_DEFAULT;
            db.collection("Raw Materials").doc(RAW_MATERIAL_DEFAULT.toString()).set(data);
            console.log("Raw Material Saved Successfully!");
            res.status(200).send(JSON.stringify({message:"Raw Material Saved Successfully!"}));
        }else{
            //Generate new raw material id and save
            docList.forEach(doc=>{
                data.raw_material_id = doc.data().raw_material_id+1;
                db.collection("Raw Materials").doc(data.raw_material_id.toString()).set(data);
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
    db.collection("Raw Materials").get()
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
    
}