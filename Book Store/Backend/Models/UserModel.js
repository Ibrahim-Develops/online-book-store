import mongoose from "mongoose";
import bcrypt from'bcrypt';

let userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true 
    },
    password: {
        type: String, 
        required: true,
        select: false
    },
    role : {
        type: String,
        enum : [ 'admin', 'user'],
        default: 'user'
    }
})

userSchema.pre('save', async function (){
    this.password = await bcrypt.hash(this.password, 10)
})


let userModel = new mongoose.model('Users', userSchema)

export default userModel