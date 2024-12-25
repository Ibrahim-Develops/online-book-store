import booksModel from "../Models/BooksModel.js";  
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import env from 'dotenv';

env.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const isPdf = file.mimetype === "application/pdf";

    if (isImage) {
      return {
        folder: "Books",
        allowedFormats: ["jpg", "png", "jpeg"], // Allowed image formats
      };
    } else if (isPdf) {
      return {
        folder: "BookPDFs",
        allowedFormats: ["pdf"], // Explicitly specify 'pdf' format
        resource_type: "auto",
         access_mode: "public", // Cloudinary will handle the file as a PDF
      };
    }
    throw new Error("Invalid file type");
  },
});


const multerData = multer({ storage });

const Createbook = async (req, res) => {
  try {
    const { name, description } = req.body;
    const files = req.files;
    const userId = req.userId;

    console.log(name, description, files, userId);
    

    const img = files.img[0].path; 
    const uploadedbook = files.uploadedbook[0].path; 

    if (!name || !img || !uploadedbook) {
      return res.status(400).json({ error: "Book name, image, and uploaded book are required" });
    }    

    const newBook = await booksModel.create({ name, img, description, uploadedbook, userId });

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
};

async function AllBooks(req, res) {
  try {
    const books = await booksModel.find({});
    res.json(books);
  } catch (error) {
    console.error("Error fetching all books:", error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}

const DeleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await booksModel.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book deleted successfully',
      book: deletedBook,
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

const UpdateUserBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const files = req.files;

    const img = files && files.img ? files.img[0].path : undefined;
    const uploadedbook = files && files.uploadedbook ? files.uploadedbook[0].path : undefined;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (img) updatedData.img = img;
    if (uploadedbook) updatedData.uploadedbook = uploadedbook;

    const updatedBook = await booksModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book updated successfully',
      book: updatedBook,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const files = req.files;

    const img = files && files.img ? files.img[0].path : undefined;
    const uploadedbook = files && files.uploadedbook ? files.uploadedbook[0].path : undefined;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (img) updatedData.img = img;
    if (uploadedbook) updatedData.uploadedbook = uploadedbook;

    const updatedBook = await booksModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book updated successfully',
      book: updatedBook,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};


const GetBookForUser = async (req, res) => {
  try {
    const userId = req.userId._id; // Accessing the userId from the request

    const books = await booksModel.find({ userId: userId });

    if (!books || books.length === 0) {
      return res.status(404).json({ error: 'No books found for this user' });
    }

    res.status(200).json({
      message: 'Books fetched successfully',
      books, 
    });
  } catch (error) {
    console.error('Error fetching books for user:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};




export { Createbook, multerData, AllBooks, DeleteBook, UpdateBook, GetBookForUser, UpdateUserBook };
