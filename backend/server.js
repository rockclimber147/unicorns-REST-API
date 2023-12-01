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
    queryObject = generateQueryObject(req.query)
    console.log('query object:', queryObject)
    result = await unicorn.find(queryObject);
    // console.log(result)
    res.json(result)
})

function generateQueryObject(incomingQuery){
    // Make an empty query object
    let queryObject = {}
    // Iterate over the query parameters
    for (const key in incomingQuery) {
        let value = incomingQuery[key]
        console.log('k:v', key, value) 
        // handle the case where the value is a relational query (weight or vampires)
        if (key.includes('_')) {
            let [field, relation] = key.split('_')
            queryObject[field] = { [`${relation}`]: incomingQuery[key] }
        // handle the case where an array of string is given (loves or name)
        } else if (key === 'loves' || key === 'name') {
            queryObject[key] = { $in: incomingQuery[key].split(',') }
        } else {
            queryObject[key] = incomingQuery[key]
        }
    }
    return queryObject
}