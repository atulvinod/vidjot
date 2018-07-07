module.exports = {
ensureAuth: function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error_msg',"Not Authorised,Login to continue");
        res.redirect('/users/login');
    }
}
}