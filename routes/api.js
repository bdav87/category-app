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
        .then(data => streamToCSV(data))
        .catch(err => res.render('index', {data: `error ${JSON.stringify(err)}`, development: true}))
    }

    function streamToCSV(category_page){
        console.log(category_page.data, category_page.meta);

        const csv_headers = [
            id,
            parent_id,
            name,
            description,
            views,
            sort_order,
            page_title,
            meta_keywords,
            meta_description,
            layout_file,
            image_url,
            is_visible,
            search_keywords,
            default_product_sort,
            custom_url
        ]

        let category_list = category.page.data;
        //let preCSV = category_list.map(category => {category});
        res.send(category_list);
    }

    function iterateOverKeys(obj) {
        return Object.keys(obj)
    }

    if (bc) {
        exportCategories(bc);
    }
})

module.exports = router;