const User = require("../models/user.js");
const generateToken = require("../utils/generatetoken.js");

 const registerUser = async(req, res)=>{
    try{
        const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
}
    catch(error){
        res.status(500).json({message : "Something is wrong with server"});
    }
};

 const loginUser = async(req,res) =>{
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              token: generateToken(user._id)
      });
    } else{
        res.status(401).json({message : 'Invalid email or password'});
    }
    }
    catch (error){
        res.status(500).json({message: "Something is wrong with server"});
    }
};

 const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        savedArticles: user.savedArticles,
        readingHistory: user.readingHistory,
        searchHistory: user.searchHistory
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Something is wrong with server" });
  }
};

 const updatePreferences = async(req,res) =>{
    try{
        const user = await User.findById(req.user._id);
        if(user){
            user.preferences = {
                ...user.preferences,
                ...req.body
            };
            await user.save();
            res.json({ message: 'Preferences updated', preferences: user.preferences });
        }
        else{
            res.status(404).json({message : 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({message : 'Something is wrong with server'});
    }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updatePreferences,
};