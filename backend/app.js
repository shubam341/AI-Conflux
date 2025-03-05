import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import  aiRoutes from './routes/ai.routes.js'
connect();

//App installation
const app=express()

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//User authentication
app.use('/users',userRoutes);

//project authentication
app.use('/projects',projectRoutes)

//ai authentication
app.use("/ai",aiRoutes)

app.get('/',(req,res)=>{
    res.send('Hello World')
});

export default app;