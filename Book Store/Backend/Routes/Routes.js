import express from 'express';
import Users from '../Functions/Users.js';
import Authorization from '../Middlewares/Authorization/Authorization.js';
import Admin from '../Middlewares/Authorization/Admin.js';
import { Createbook, multerData, AllBooks, DeleteBook, UpdateBook, GetBookForUser, UpdateUserBook } from '../Functions/Books.js'; 

let { CreateUser, ExisingUser, Logout, AllUsers } = Users;
let Router = express.Router(); 

Router.route("/signup").post(CreateUser);
Router.route("/login").post(ExisingUser);
Router.route('/logout').post(Logout);
Router.route('/allusers').get(AllUsers);


Router.route('/allbooks').get(AllBooks)
Router.post('/createbook', multerData.fields([{ name: "img", maxCount: 1 }, { name: "uploadedbook", maxCount: 1 }]), Authorization, Createbook);

Router.get('/userbooks', Authorization, GetBookForUser); 
Router.route('/updateuserbook/:id').put(multerData.fields([{ name: 'img', maxCount: 1 }, { name: 'uploadedbook', maxCount: 1 }]), Authorization, UpdateUserBook);  

Router.route('/updatebook/:id').put(multerData.fields([{ name: 'img', maxCount: 1 }, { name: 'uploadedbook', maxCount: 1 }]), UpdateBook);  
Router.route('/deletebook/:id').delete(DeleteBook);

export default Router;
