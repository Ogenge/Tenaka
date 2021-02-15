const express=require('express');
const bodyparser=require('body-parser');
const rest=require('./routes');
const config=require('./config');

const app=express()

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json())

//Include routes
app.use('/api',rest);

//Server
app.listen(process.env.port||config.port,()=>{
    console.log('All is well '+config.port);
})