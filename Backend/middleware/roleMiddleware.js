const authorizeRole=(...allwoedRoles)=>{
    return (req,res,next)=>{
        console.log("ALLOWED ROLES");
        console.log(allwoedRoles);
        console.log("REQUSTED USER'S ROLE ");
        console.log(req.user.role);
        if(!allwoedRoles.includes(req.user.role)){
            return res.status(403).json({message: "Access Denied"});
        }
        next();
    }
}

module.exports = authorizeRole;