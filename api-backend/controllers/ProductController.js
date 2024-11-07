const express = require('express');
const app = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const { error } = require('console');
//----------------------------------file upload ----------------------
const fileUpload = require('express-fileupload')
app.use(fileUpload())
dotenv.config();

app.post("/create", async (req, res)=> {
    try {
        await prisma.product.create({
            data: req.body,
        });

        res.send({ message: 'success' });
    } catch (e) {
        res.status(500).send({error: e.messages})
    }
})
app.get('/list', async (req, res)=> {
    try {
        const data = await prisma.product.findMany({
            orderBy:{
                id: 'desc'
            },where:{
                status: 'use'
            }
        })
        res.send({result: data})
    } catch (e) {
        res.status(500).send({error: e.message});
    }
})
app.delete('/remove/:id', async (req, res)=>{
    try {
        await prisma.product.update({
            data: {
                status: 'delete'
            },where: {
                id: parseInt(req.params.id)
            }
        })
        res.send({message: 'success'})
    } catch (e) {
        res.status(500).send({error: e.message});
    }
})
app.put('/update', async (req, res)=> {
    try {
        const fs = require('fs');
        const oldData = await prisma.product.findFirst({
            where: {
                id: parseInt(req.body.id)
            }
        })
        //remove Old image
        const imagePath = '../api/uploads/'+ oldData.img; //ตำเเหน่งรูป

        if(fs.existsSync(imagePath)){ //ถ้าไฟล์ภาพที่ต้องการจะลบมีอยู่จริง => ลบภาพ
            await fs.unlinkSync(imagePath)//ลบรูปภาพเมื่อกดupdate ภาพใหม่ไปเเทนที่
        }

        await prisma.product.update({ 
            data: req.body,
            where: {
                id: parseInt(req.body.id)
            }
        })
        res.send({message: 'success'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.post('/upload', async (req, res) => {
    try {
        if(req.files != undefined){
            if(req.files.img != undefined){
                const img = req.files.img;
                const fs = require('fs');
                const myDate = new Date();
                const y = myDate.getFullYear();
                const m = myDate.getMonth()+1;
                const d = myDate.getDate();
                const h = myDate.getHours();
                const mi = myDate.getMinutes();
                const s = myDate.getSeconds();

                const arrFileName = img.name.split('.');
                const ext = arrFileName[arrFileName.length-1]
                const newName = `${y}${m}${d}${h}${mi}${s}.${ext}`
                img.mv('../api/uploads/' + newName, (err)=> {
                if(err){
                    res.status(500).send({error:err.message}) 
                }else{
                    res.send({ newName: newName});
                }})    
            }else{
                res.status(400).send('notimplemented');
            }
        }
    } catch (e) {
        res.status(501).send({message:e.message})
    }
})
app.post('/uploadFromExcel', (req, res)=> {
    try {
        const fileExcel = req.files.fileExcel;

        fileExcel.mv('./uploads/' + fileExcel.name, (err)=> {
            if(err) throw err;
            // read form file and insert to database
            res.send({message: 'success'})
        })
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = app;
