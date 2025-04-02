import express from 'express';
import dotenv from 'dotenv';
import connectDB from './DB/connection.js';
import * as routes from './index.routes.js';
import cors from 'cors';
dotenv.config({path:'./config/.env'});
connectDB();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello, Express with ES6 is working!');
});
app.use(`/deepmetrics/api/v1/sector`, routes.sectorRouter);
app.use(`/deepmetrics/api/v1/auth`, routes.authRouter);
app.use(`/deepmetrics/api/v1/company`, routes.companyRouter);
app.use(`/deepmetrics/api/v1/mainclass`, routes.classRouter);

app.use('*',(req,res)=>{res.status(404).json({message:'Page Not Found'})});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
