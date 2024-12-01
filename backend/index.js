import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv';
dotenv.config();

connectDB();
const app = express()
const port = process.env.PORT || 3000


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})