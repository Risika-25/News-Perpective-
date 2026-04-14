const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async(req, res, next) =>{
    let token;
    console.log("🛡️ Auth Middleware Triggered");
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            console.log("🔑 Token extracted:", token.substring(0, 10) + "...");
            
            if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
      }
      
      console.log('Token received:', token.substring(0, 20) + '...');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
             console.log('Token decoded:', decoded);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
            next();
        }
        catch(error){
            console.error(error);
            res.status(401).json({message: 'Not authorized, token failed'});
        }
    }
    if(!token){
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports= {protect};