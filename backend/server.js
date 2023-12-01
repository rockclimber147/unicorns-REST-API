const express = require('express')
const mongoose = require('mongoose')
const unicorn = require('./Unicorn.js')
const cors = require('cors')

const app = express()
mongoose.connect('mongodb+srv://rockclimber147:GenericAtlaspassw0rd@assignment-3-unicorns.kaartmf.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('connected to mongodb')
}).catch(err => {
    console.log(err)
})

app.use(cors())

app.listen(3000, () => {
    console.log('listening on port 3000')
})

async function getUnicorns(name) {
    return await unicorn.find({ $or: [{ name: name }, { weight: { $lt: 1700} }] })
}

app.use(express.urlencoded({ extended: true}))

app.get('/unicorns', async (req, res) => {
    console.log('request received!:', req.query)
    result = await unicorn.find();
    // console.log(result)
    res.json(result)
})

function generateQueryObject(req){
    // Make an empty query object
    let queryObject = {}
    // Iterate over the query parameters
    for (const key in req.query) {
        let value = req.query[key]
        // handle the case where the value is a relational query
        if (value.includes('_')) {
            
            let [field, relation] = value.split('_')
            queryObject[field] = { [`${relation}`]: req.query[key] }
        } else {
            queryObject[key] = req.query[key]
        }
    }
    return queryObject
}