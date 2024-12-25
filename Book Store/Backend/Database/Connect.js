import mongoose from "mongoose";

function connect() {
    mongoose.connect('mongodb://localhost:27017/Books').then(()=>{
        console.log("MongoDB Connected");  
    }).catch(()=>{
        console.log("MongoDB Not Connected");
    })
}



export default connect

