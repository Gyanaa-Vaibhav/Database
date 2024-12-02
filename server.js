import express from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import path from "node:path";
import url from "node:url";
import dotenv from 'dotenv';
import globalErrorHandler from "./globalErrorHandler.js";
import authenticateToken from "./authenticateToken.js";

dotenv.config();
const app = express();
const PORT = 5173;
const SECRET_KEY = process.env.SERECT_KEY
const users = [];

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())

app.get('/profile', authenticateToken ,(req,res)=>{
    res.render('index')
})

app.get('/login',(req,res)=>{
    res.render("index",{name:'Gyanaa Vaibhav'})
})

app.post('/login',(req,res,next)=>{
    try{
        const {user,password} = req.body;
        const isUser = users.find(u => {
            return (u.user === user && bcrypt.compare(password,u.password))
        })
        if(!isUser){
            return res.status(404).send('Error User Not Found')
        }

        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(202).json({token})

    }catch (err){
        next(err)
    }
})


app.post('/register',async (req,res,next)=>{
    try{
        const {user,password} = req.body;

        const userExists = users.find(u => {
            return (u.user === user)
        })

        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        if(user && password){
            const hashedPassword = await bcrypt.hash(password,10)
            users.push({"user": user, "password" : hashedPassword})
            console.log(users)
        }else {
            return res.status(404).send("Both password and username required")
        }
        res.status(201).json({'message': "User Created Successfully"})
    }catch (err){
        next(err)
    }
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.use(globalErrorHandler)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})
