const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router)
const bodyParser = require('body-parser');
const cors = require('cors');



mongoose.Promise = global.Promise;
mongoose.connect(config.uri,(err)=>{
if(err){
    console.log('Could notconnect to database');
}else{
    console.log('connected to databse' +config.db);
}
});


app.use(cors({
    origin:'http://localhost:4200'
}))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist'));
app.use('/authentication', authentication)
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname +'/client/dist/client/index.html'));
});
app.listen(3000,()=>{
    console.log('Server is running');
});