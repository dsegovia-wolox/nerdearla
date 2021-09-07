const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose');
const nats = require('node-nats-streaming')

const { createHmac, randomBytes } = require("crypto")

const client = randomBytes(6).toString('hex');
const stan = nats.connect('nerdearla', 'buscador_client' + client, {
  url: `http://${process.env.NATS_HOST}:${process.env.NATS_PORT}`,
});


stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  stan.subscribe('cosas:add').on('message', (msg) => {
    const data = JSON.parse(msg.getData())
    console.log(data)

    new Cosa(data).save();
  })
  
});




app.use(express.json())

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {useNewUrlParser: true});
mongoose.connection.once('open', function() {
  console.log("Connection Successful!");
});
mongoose.connection.on('error', err => {
  console.log(err);
  process.exit()
});

const cosasSchema = mongoose.Schema({
  nombre: String
});

const Cosa = mongoose.model('Cosa', cosasSchema, 'cosastore');

app.get('/api/buscador/', async function (req, res) {
  console.log(`client response ${client}`)
  res.json(await Cosa.find())
}) 

 
app.listen(process.env.PORT, function(){
  console.log(`Server Buscador is listening ${process.env.PORT}`);
})