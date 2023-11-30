const express = require('express')
const mongoose = require('mongoose')
const unicorn = require('./Unicorn.js')

const app = express()
mongoose.connect('mongodb+srv://rockclimber147:GenericAtlaspassw0rd@assignment-3-unicorns.kaartmf.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('connected to mongodb')
}).catch(err => {
    console.log(err)
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})

async function getUnicorns() {
    return await unicorn.find()
}

getUnicorns().then(unicorns => {
    console.log(unicorns)
})