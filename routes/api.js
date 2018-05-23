const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');
const bcAuth = require('../lib/bc_auth');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({limits: {files: 1, fileSize: 1000000}, storage: storage });
const streamifier = require('streamifier');

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

    let date = new Date().toDateString().split(' ').join('');
    let filename = `category-export-${date}.csv`;
    let csvStream = csv.createWriteStream({headers: true});
    let writableStream = fs.createWriteStream(filename);

    csvStream.pipe(writableStream);
    
    function exportCategories(bc_api, path) {
        bc_api.get(`/catalog/categories${path}`)
        .then(categories => {
            streamToCSV(categories.data, categories.meta.pagination);
        })
        .catch(err => res.send(`Export error: ${err}.}`))
    }

    function streamToCSV(categories, meta){
        
        const category_list = categories.map(category => Object.assign({}, category))

        function determinePageForCSV(current_categories){
                
                if (meta.current_page < meta.total_pages) {
                    current_categories.forEach(writeToCSV);
                }
                if (meta.current_page == meta.total_pages) {
                    current_categories.forEach(writeAndPublishCSV);
                }

                function writeToCSV(element, index, array){
                    if (index == array.length - 1) {
                        csvStream.write(element);
                        const path = meta.links.next;

                        exportCategories(bc, path);
                    } else {
                        csvStream.write(element);
                    }
                }
                function writeAndPublishCSV(element, index, array) {
                    if (index == array.length - 1) {
                        csvStream.write(element);
                        sendCSV();
                    } else {
                        csvStream.write(element);
                    }
                }
        }

        determinePageForCSV(category_list);

        function sendCSV(){
            csvStream.end()
            writableStream.on('finish', function(){
                console.log('Done with CSV');
    
                res.download(filename, (err) => {
                if (err) {
                    console.log(`csv send err: ${err}`)
                }
                });
    
            });
        }
        
        
    }

    if (bc) {
        exportCategories(bc, '?page=1&limit=250');
    }
})

router.post('/import', upload.single('csvFile'), (req, res) => {
    let uploadedCSV = streamifier.createReadStream(req.file.buffer);
    let csvStream = csv();

    csvStream
    .fromStream(uploadedCSV, {headers: true})
    .on('data', data=>console.log(data))
    .on('end', ()=> {
        console.log('done');
        res.send('maybe it uploaded?');
    });

    uploadedCSV.pipe(csvStream);

})


module.exports = router;
