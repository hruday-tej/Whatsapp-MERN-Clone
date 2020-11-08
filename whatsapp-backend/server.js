// importing
// we are using type = module because to have 'import express from "express" instead of const express = include("express")'

import express from 'express' ;
import mongoose from 'mongoose';
import Messages from "./dbMessages.js";
// const Pusher = require('pusher');

import Pusher from "pusher";
// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1103889",
    key: "499e30148139eddda3dd",
    secret: "5d2dd6fce31d33933208",
    cluster: "ap2",
    useTLS: true
  });
// middleware
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
});
// DB Config
const connection_url = 'mongodb+srv://admin:YaLIygz25jTFJiFq@cluster0.h6ru5.mongodb.net/whatsappdb?retryWrites=true&w=majority';

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', ()=>{
    console.log("********DB CONNECTED********");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change) => {
        console.log("Change occured",change);

        if(change.operationType == 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('mesages','inserted',{
                name: messageDetails.name,
                message: messageDetails.message
            });
        }else{
            console.log("Error triggering pusher");
        }
    })
})
//  ??

// api routes

app.get('/',(req,res)=>res.status(200).send('hello paikhan'));

app.post('/messages/new', (req,res)=>{
    const dbMessage = req.body;

    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);
        }
    })
})

app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
});

// listen
app.listen(port,()=>console.log('Listening on localhost:'+port));


// YaLIygz25jTFJiFq
