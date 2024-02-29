const express = require('express');
const URL = require('./models/url');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const app = express();
const port = 8001;
connectToMongoDB('mongodb://localhost:process.env.PORT/short-url')
.then(()=>console.log('Mongodb connected'))
app.use(express.json());
app.use("/url", urlRoute);
app.get('/:shortId', async (req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push: {
            visitHistory:{
                timestamp: Date.now()
            }
        }
    })
    res.redirect(entry.redirectURL)
})
app.listen(port, ()=>{
    console.log(`The app is listening on ${port}`);
})