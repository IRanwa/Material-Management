//Register Login
exports.regLogin = function(res,setData,db,callback){
    const username = setData.username;
    const password = setData.pass;
    const userRole = setData.userRole;

    //Remove Login Information
    delete setData["userRole"];
    delete setData["pass"];

    //Find login information already registered
    db.collection("Login").where("username","==",username).get()
    .then(docList=>{
        //If no records save new login info or else return username exists
        if(docList.docs.length===0){
            const data = {
                username : username,
                password : password,
                lastLogin : new Date().toLocaleString(),
                userRole: userRole
            }

            //Save new login
            const docRef = db.collection("Login").doc(username);
            docRef.set(data);
            console.log("Register Login -> Login Information Saved Successfully!");
            return callback(null,"Login Information Saved Successfully!");
        }else{
            console.log("Register Login -> Login Username Already Registered!");
            res.status(500).send(JSON.stringify({message:"Login Username Already Registered!"}));
            return callback(true,null);
        }
    }).catch(error=>{
        console.log(error);
        console.log("Register Login -> Existing Login Details Searching Error!");
        res.status(500).send(JSON.stringify({message:"Existing login details searching error!"}));
        return callback(error,null);
    });
};

// exports.getLoginDetails = function(req,res,db,callback){
//     const username = req.body.username;
//     db.collection("Login").where("username","==",username).get()
//     .then(docList=>{
//         if(docList.docs.length===0){
//             console.log("Searched login details not found!");
//             res.status(500).send(JSON.stringify({message:"Searched login details not found!"}));
//             return callback(true,null);
//         }else{
//             docList.forEach(doc => {
//                 console.log(callback)
//                 if(callback===null){
//                     res.status(200).send(JSON.stringify(doc.data()));
//                 }

//                 const keys = Object.keys(doc.data());
//                 keys.forEach(key=>{
//                     req.body[key] = doc.data()[key];
//                 })
//                 return callback(null,req.body);
//             });
//         }
//         return null;
//     }).catch(error=>{
//         console.log(error);
//         console.log("Searching login details error!");
//         res.status(500).send(JSON.stringify({message:"Searching login details error!"}));
//     })
// };