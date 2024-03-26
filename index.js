const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// 引入加密依赖
const md5 = require('md5')
// 引入生成和验证token
const jwt = require('jsonwebtoken')
// 连接数据库
// mongoose.connect('mongodb://127.0.0.1:27017/shop') //本地数据库地址
// 线上数据库
mongoose.connect('mongodb+srv://jinting006:123456jt@cluster0.caymdf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
// 判断回调函数
mongoose.connection.on('open',()=>{
    console.log('连接成功');
})
// 写插入的数据集合
const registerSchema = new mongoose.Schema({
    email:String,
    password:String
})
// 定义模型
const registerModel = mongoose.model('register',registerSchema)
const app = express()
// 自己定义的私钥
const secret = 'dssffdfcdd'
// 跨域访问
app.use(cors())
// 使用json跟urlencoded中间件接收post传过来的json数据，放在req.body上
app.use(express.json())
app.use(express.urlencoded({extends:false}))
// 封装加密中间件
const encryption =(req,res,next)=>{
    let password = req.body.password
    console.log(password);
    req.body.password = md5(password)
    next()
}
// 注册接口
app.post('/api/v1/register',encryption,(req,res)=>{
    console.log(req.body);
    registerModel.create(req.body).then((data)=>{
        console.log('注册成功');
        res.send({
            code:1,
            message:'注册成功',
            data:data
        })
    }).catch((err)=>{
        console.log('注册失败');
        res.send({
            code:0,
            message:'注册失败',
            data:err
        })
    })

})
// 登录
app.post('/api/v1/login',encryption,(req,res)=>{
    console.log(req.body);
    registerModel.findOne(req.body).then((data)=>{
        console.log(123,'登录成功');
        console.log('data',data);
        if(data){
            res.send({
                code:1,
                message:'登录成功',
                // 生成token返回，jwt.sign(参数，加密串)
                token:jwt.sign({uid:data._id,exp:Math.ceil(Date.now()/1000)+7200},secret)
            })
        }else{
            res.send({
                code:0,
                message:'登录失败'
            })
        }
        
    }).catch((err)=>{
        console.log('登录失败');
        res.send({
            code:0,
            message:'登录失败',
            data:err
        })
    })

})
app.listen('8080',()=>{
    console.log('服务器已启动');
})