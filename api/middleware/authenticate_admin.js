var { LineUser } = require("../models/lineuser");
const jwt = require("jsonwebtoken");

var authenticate_admin = (req, res, next) => {
    /**cond:TestMode*/
    if(process.env.NODE_ENV=='test'){
        console.log('--[authenticate_admin] pass for test')
        //TODO get testuser
        next()
    }
    /** Decode idToken in session */
    // if(req.session.lineuser.id_token){
        var decoded;
        try {
            //== verify JWT
            // var token = req.session.lineuser.id_token
            var token = req.header('x-auth')
            decoded = jwt.verify(
                token, 
                process.env.LINE_LOGIN_CHANNEL_SECRET);
            // console.log('--[auth] decode.sub',decoded.sub)
            //== check mongodb
            LineUser.findOne({
                lineuserid  : decoded.sub,
                isadmin : true
            }).then( (user)=>{
                if (!user) { return Promise.reject(); }
                req.user=user;
                next();
            }).catch((e) => {
                console.log('--[authenticate] 401',e)
                res.status(401).send();
            });
        }catch (e) {
            console.log(e)
            return Promise.reject();
        }
    // }else{
    //     console.log('--[authenticate] no session id_token')
    //     res.status(400).send();
    // }
};


module.exports = { authenticate_admin };
