const jwt = require('jsonwebtoken');

exports.generateToken = function(req,res){
    const token = jwt.sign({data:"this"},'material_management_secret',{expiresIn:15*60});
    res.send(token);
};