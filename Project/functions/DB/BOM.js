const BOM_ID = 1;

exports.newBOM = function(req,res,db){
    db.collection("BOM").orderBy("bom_id","desc").limit(1).get()
    .then(docsList=>{
        let data = req.body;
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