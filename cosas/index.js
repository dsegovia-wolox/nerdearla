const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose');
const nats = require('node-nats-streaming')

const { createHmac, randomBytes } = require("crypto")

const stan = nats.connect('nerdearla', 'cosas_client' + randomBytes(6).toString('hex'), {
  url: `http://${process.env.NATS_HOST}:${process.env.NATS_PORT}`,
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');
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

app.get('/api/cosas', async function (req, res) {
  res.json(await Cosa.find())
}) 


app.get('/api/cosas/todos', async function (req, res) {
  res.json(await Cosa.find())
}) 


app.post('/api/cosas', function (req, res) {
  try {
    const data = {nombre: req.body.nombre}
    new Cosa(data).save();

    stan.publish('cosas:add', JSON.stringify(data), (err, guid) => {
      if (err) {
        console.log('publish failed: ' + err)
      } else {
        console.log('published message with guid: ' + guid)
      }
    })

    res.send(req.body);

  } catch (error) {
    console.log(error)
  }
  
})
 
app.listen(process.env.PORT, function(){
  console.log(`Server Cosas is listening ${process.env.PORT}`);
})