const express = require('express');
const app = express()
const port = process.env.PORT || 3000;
const reportRouter = require('./routers/report');
const newsRouter = require('./routers/news');

require('./db/mongoose');
app.use(express.json());

app.use(reportRouter);
app.use(newsRouter);


app.listen(port,()=>{
    console.log('server is running')
})