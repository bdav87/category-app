const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');
const bcAuth = require('../lib/bc_auth');
const csv = require('fast-csv');

let bc;

bcAuth()
.then(data => bc = data)
.catch(err => console.log(err))

// TEST ROUTE to generate a category
router.get('/single', (req,res) => {

    function createSampleCategory(bc_api) {
        let category = {
            parent_id: 0,
            name: `Sample Category ${Math.round(Math.random() * 1000000)}`,
            description: 'A sample category generated by the app'
        }
        bc_api.post('/catalog/categories', category)
        .then(data => res.send(data))
        .catch(err => res.send(`There was an error: ${err}.}`))
    }

    if (bc) {
        createSampleCategory(bc);
    }
    
})
// When a user hits the export button all categories
// will be exported into a CSV file
router.get('/export', (req, res) => {

    function exportCategories(bc_api) {
        bc_api.get('/catalog/categories?limit=250')
        .then(data => res.render('index', {data: JSON.stringify(data), development: true}))
        .catch(err => res.render('index', {data: JSON.stringify(err), development: true}))
    }

    if (bc) {
        exportCategories(bc);
    }
})

module.exports = router;