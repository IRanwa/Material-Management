const GRN_ID = 1;

exports.newGRN = function(req,res,db){
    db.collection("GRN").orderBy("grn_id","desc").limit(1).get()
    .then(docsList=>{
        let data = req.body;
        if(docsList.docs.length===0){
            data.grn_id = GRN_ID;
            db.collection("GRN").doc(GRN_ID.toString()).set(data);

            const requisition_id = data.requisition_id;
            if(requisition_id!==undefined){
                db.collection("Requisition").doc(requisition_id.toString()).update({status:"Completed"});
            }

            res.status(200).send(JSON.stringify({message:"GRN saved successfully!"}));
        }else{
            docsList.forEach(doc=>{
                const id = doc.data().grn_id+1;
                data.grn_id = id;
                db.collection("GRN").doc(id.toString()).set(data);

                const requisition_id = data.requisition_id;
                if(requisition_id!==undefined){
                    db.collection("Requisition").doc(requisition_id.toString()).update({status:"Completed"});
                }

                res.status(200).send(JSON.stringify({message:"GRN saved successfully!"}));
            })
        }
        return null;
    }).catch(error=>{
        console.log(error);
        res.status(500).send(JSON.stringify({message:"GRN notices searching error!"}));
    })
}

exports.getGRNList = function(req,res,db){
    db.collection("GRN").get()
    .then(docsList=>{
        let GRNs = [];
        docsList.forEach(doc=>{
            GRNs.push(doc.data());
        });
        res.status(200).send(JSON.stringify({GRNs}));
        return null;
    }).catch(function(error){
        console.log(error);
        res.status(500).send(JSOn.stringify({message:"GRNs searching error!"}));
    })
}