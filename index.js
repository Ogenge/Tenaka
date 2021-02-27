const express=require('express');
const bodyparser=require('body-parser');
const rest=require('./routes');
const config=require('./config');
const http=require('http');
const fs=require('fs');
const url=require('url');

const app=express()

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json())

//Include routes
app.use('/api',rest);

//create http server
http.createServer(function(req,res){
    //parse the request containing file name
    const pathname=url.parse(req.url).pathname;
    
    //read request html
    fs.readFile(pathname.substr(1),function(err,data){
        if(err){
            console.log(err);
            //404 Not found
            res.writeHead(404,({'Content-Type':'text/html'}));
        }else{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data.toString());
        }

        res.end();
    });
}).listen(3001)
console.log('Server up at 3001')



//Server
app.listen(process.env.port||config.port,()=>{
    console.log('All is well '+config.port);
})