import userModel from "../Models/UserModel.js";
import generateJWT from "../Middlewares/JWT/GenToken.js";
import bcrypt from 'bcrypt'

let CreateUser = async (req, res) => {

    try {
        let existingUser = await userModel.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        let user = await userModel.create(req.body);
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

let ExisingUser = async (req, res) => {

    if(!req.body.name || !req.body.password){
       return res.json({msg : 'Please provide email and password'})
    }

    let user = await userModel.findOne({ name : req.body.name }).select('+password')
    
    if (!user){
       return res.json({ msg : 'User not found'})
    }
      
    let bodypassword = String(req.body.password);
    let encpass = await bcrypt.compare(bodypassword, user.password)

    
    if (encpass) {
        let token = generateJWT(user);
        res.cookie('token', token);
        res.cookie('role', user.role);
        return res.json({ success: true, message: "Login Successful" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid password" });
    }
};

let AllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('+password');  
        res.json(users);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

let Logout = (req, res)=>{

    res.clearCookie('token');
    res.clearCookie('role');
    return res.json({ success: true, message: "Logout Successful" });
}

export default { CreateUser, ExisingUser, Logout, AllUsers };
