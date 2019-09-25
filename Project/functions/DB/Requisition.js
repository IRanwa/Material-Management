const REQUISITION_ID = 1;

exports.newRequisition = function(req,res,db){
    db.collection("Requisitions").orderBy("requisition_id","desc").limit(1).get()
    .then(docList=>{
        let data = req.body;
        
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