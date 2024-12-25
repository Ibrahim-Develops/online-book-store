import mongoose from "mongoose";

let bookschema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    uploadedbook:{
        type: String,
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
})

let booksModel = mongoose.model("Books", bookschema)

export default booksModel;