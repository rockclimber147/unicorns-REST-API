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

app.use(express.urlencoded({ extended: true }))

app.get('/unicorns', async (req, res) => {
    try {
    console.log('request received!:', req.query)
    let displayObject = generateDisplayObject(req.query.display)
    delete req.query.display;

    queryObject = generateQueryObject(req.query)
    console.log('query object:', queryObject)

    result = await unicorn.find(queryObject, displayObject);
    // console.log(result)
    res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

function generateDisplayObject(displayString) {
    try {
        // id is disabled by default
        let displayObject = { _id: 0 }
        let displayArray = displayString.split(',')
        for (const key of displayArray) {
            displayObject[key] = 1
        }
        return displayObject
    } catch (err) {
        console.log(err)
        throw new Error('Invalid display parameters!')
    }
}

    function generateQueryObject(incomingQuery) {
        try{
        // Make an empty query object
        let queryParams = [];
        let queryObject = {};
        // Add and/or to the query object
        queryObject[incomingQuery.fieldRelationType] = queryParams;
        // Remove the fieldRelationType from the incoming query so it's not processed
        delete incomingQuery.fieldRelationType;
        // Iterate over the query parameters
        for (const key in incomingQuery) {
            let value = incomingQuery[key]
            console.log('k:v', key, value)
            // handle the case where the value is a relational query (weight or vampires)
            if (key.includes('_')) {
                let [field, relation] = key.split('_')
                queryParams.push({ [`${field}`]: { [`${relation}`]: incomingQuery[key] } })
                // handle the case where an array of string is given (loves or name)
            } else if (key === 'loves' || key === 'name') {
                queryParams.push({ [`${key}`]: { $in: incomingQuery[key].split(',') } })
            } else {
                queryParams.push({ [`${key}`]: incomingQuery[key] })
            }
        }
        // Return an empty object if no query parameters are given
        if (queryParams.length === 0) {
            queryObject = {}
        }
        return queryObject
    } catch (err) {
        console.log(err)
        throw new Error('Invalid query parameters!')
    }
}