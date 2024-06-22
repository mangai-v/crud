const express = require('express')
const fs = require('fs')
const cors = require('cors')
const app = express()
const PORT = 8000
const users = require('./sample.json')
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PATCH','DELETE']
}))
app.get('/users',(req,res)=>{
    res.json(users)
})
app.delete('/users/:id',(req,res)=>{
    const id = Number(req.params.id)
    const filteredUser = users.filter((user)=>user.id!==id)
    fs.writeFile('./sample.json',JSON.stringify(filteredUser),(err,data)=>{
        return res.json(filteredUser)
    })
})
app.post('/users',(req,res)=>{
    let {name,age,city} = req.body
    if(!name||!age||!city){
        res.status(400).send({message:'All fields are required'})
    }
    let id = Date.now()
    users.push({id,name,age,city})
    fs.writeFile('./sample.json',JSON.stringify(users),(err,data)=>{
        res.json({message:'Users details added successfully'})
    })
})
app.patch('/users/:id',(req,res)=>{
    let {name,age,city} = req.body
    if(!name||!age||!city){
        res.status(400).send({message:'All fields are required'})
    }
    let id = Number(req.params.id)
    let index = users.findIndex((user)=>user.id == id)
    users.splice(index,1,{...req.body})
    fs.writeFile('./sample.json',JSON.stringify(users),(err,data)=>{
        res.json({message:'Users details updated successfully'})
    })
})
app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
})