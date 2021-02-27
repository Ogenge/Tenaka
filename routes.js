const express=require('express');
const router=express.Router();
const mysql=require('mysql');
const config=require('./config');
const AWS=require('aws-sdk');
const imgBuffer=require('./imgBuffer');
const {AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY}=config.aws;

AWS.config.update({
    accessKeyId:AWS_ACCESS_KEY_ID,
    secretAccessKey:AWS_SECRET_ACCESS_KEY,
    region:''
});

const s3bucket=new AWS.S3({params:{Bucket:''}});

const imageUpload=(path,buffer)=>{
    const data={
        Key:path,
        Body:buffer,
        ContentEncoding:'base64',
        ContentType:'image/jpeg',
        ACl:'public-read'
    };
    return new Promise((resolve,reject)=>{
        s3bucket.putObject(data,(err)=>{
            if (err){
                reject(err);
            }
            else{
                resolve(s3Url+path);
            }
        });
    });
};



///connect db
var pool=mysql.createPool(config.mysql);

//all routes
router.get("/",function(req,res){
    res.json({"msg":"Hello"});
});

//student registration
router.post("/studentreg",function(req,res){
    const image=req.body.photo;
    const uploadUrl=imageUpload('',image);

    var query="INSERT INTO ??(??,??,??,??,??,??) VALUES(?,?,?,?,?,?)";
    var table=["Name","Age","Marital","Gender","Height","Location","PhotoUrl",req.body.name,req.body.age,req.body.marital,req.body.gender,req.body.height,req.body.gps,uploadUrl]
    query=mysql.format(query,table);
    pool.query(query,(err,rows)=>{
        if(err){
            console.log(err)
            return res.json({"Stat":1,"Msg":"An error occurred!"})
        }
        res.json({"Stat": 0,"Msg":"User "+req.body.name+ " registered successfully","User":req.body.name})
    });
});

//IQ questions 
router.get("/iqtest",function(req,res){
    var query="SELECT * FROM ??";
    let table=["IQTest"];
    query=mysql.format(query,table);
    pool.query(query,(err,rows)=>{
        if(err){
            console.log(err)
            return res.json({"Stat":1,"Msg":"An error occurred!"})
        }
        res.json({"Stat": 0,"Msg":"","Test":rows})
    })
});

//IQ Answers and calculation of results
router.put('/iqans',function(req,res){
    const ans=push(req.body.values);
    const total=getIQ(ans);//get total of iq

    var query="UPDATE ?? SET ??=? WHERE ??=?";
    var table=["TOTAL",total,"USERID",req.body.userid];
    query=mysql.format(query,table);
    pool.query(query,(err,rows)=>{
        if(err){
            console.log(err)
            return res.json({"Stat":1,"Msg":"An error occurred!"})
        }
        res.json({"Stat": 0,"Msg":"IQ Test result updated successfully"})
    })
});


//calculate total of iq results
function getIQ(ans){
    var total=0;
    for(var an in ans){
        total += ans[an];
    }
    return total;
}


module.exports=router;