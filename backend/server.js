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
        let sortObject;
        let applySort = false;
        if (req.query.sort !== "") {
            sortObject = generateSortObject(req.query.sort)
            applySort = true;
        }
        delete req.query.sort;

        queryObject = generateQueryObject(req.query)
        console.log('query object:', queryObject)
        if (applySort) {
            result = await unicorn.find(queryObject, displayObject).sort(sortObject);
        } else {
            result = await unicorn.find(queryObject, displayObject);
        }
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

function generateSortObject(sortString) {
    try {
        let sortObject = {}
        let sortArray = sortString.replaceAll('asc', '1').replaceAll('desc', '-1').split(',')
        for (const key of sortArray) {
            let [field, order] = key.split('.')
            sortObject[field] = parseInt(order)
        }
        return sortObject
    } catch (err) {
        console.log(err)
        throw new Error('Invalid sort parameters!')
    }
}

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
    try {
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
                if (relation === '$btwn') {
                    let [min, max] = value.split(',')
                    queryParams.push({ [`${field}`]: { $gte: min, $lte: max } })
                } else {
                    queryParams.push({ [`${field}`]: { [`${relation}`]: incomingQuery[key] } })
                }
                // handle the case where an array of string is given (loves or name)
            } else if (key === 'loves' || key === 'name') {
                queryParams.push({ [`${key}`]: { $in: incomingQuery[key].split(',') } })
            } else {
                queryParams.push({ [`${key}`]: incomingQuery[key] })
            }
            console.log('query params:', queryParams)
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