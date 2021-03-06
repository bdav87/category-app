const express = require('express');
const router = express.Router();
const bcAuth = require('../lib/bc_auth');
const csv = require('fast-csv');
const fs = require('fs');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({limits: {files: 1, fileSize: 1000000}, storage: storage });
const streamifier = require('streamifier');
const EventEmitter = require('events');
/* const dotenv = require('dotenv');
dotenv.config(); */

function stringToYesNo(string) {
    if (string.toString().toLowerCase() == 'true') {
        return 'Y';
    } else {
        return 'N';
    }
}

function yesNoToBoolean(string) {
    if (string.toLowerCase() == 'y') {
        return true;
    } else {
        return false;
    }
}

// TEST ROUTE to generate a category
router.get('/single', (req,res) => {
    let bc;
    let hash = req.session.storehash;

    bcAuth(hash)
        .then(data => {
            bc = data;
            createSampleCategory(bc);
        })
        .catch(err => console.log(err));

    function createSampleCategory(bc_api) {
        let category = {
            parent_id: 0,
            name: `Sample Category ${Math.round(Math.random() * 1000000)}`,
            description: 'A sample category generated by the app'
        };
        bc_api.post('/catalog/categories', category)
            .then(data => res.send(data))
            .catch(err => res.send(`There was an error: ${err}.}`));
    }

});
// When a user hits the export button all categories
// will be exported into a CSV file
router.get('/export', (req, res) => {
    console.log('session:',req.session);
    let hash = req.session.storehash;
    let bc;

    bcAuth(hash)
        .then(data => {
            bc = data;
            exportCategories(bc, '?page=1&limit=250');
        })
        .catch(err => console.log(err));

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
            .catch(err => res.send(`Export error: ${err}.}`));
    }

    function streamToCSV(categories, meta){
        
        const category_list = categories.map(category => Object.assign({}, category));

        function determinePageForCSV(current_categories) {
            if (meta.current_page < meta.total_pages) {
                current_categories.forEach(writeToCSV);
            }
            if (meta.current_page == meta.total_pages) {
                current_categories.forEach(writeAndPublishCSV);
            }
            function writeToCSV(element, index, array) {
                if (index == array.length - 1) {
                    csvStream.write(formatExportContent(element));
                    const path = meta.links.next;
                    exportCategories(bc, path);
                } else {
                    csvStream.write(formatExportContent(element));
                }
            }
            function writeAndPublishCSV(element, index, array) {
                if (index == array.length - 1) {
                    csvStream.write(formatExportContent(element));
                    sendCSV();
                } else {
                    csvStream.write(formatExportContent(element));
                }
            }
            function formatExportContent(category) {
                return {
                    'Category ID': parseInt(category['id']),
                    'Parent ID': parseInt(category['parent_id']),
                    'Category Name': category['name'],
                    'Category Description': category['description'],
                    'Sort Order': category['sort_order'],
                    'Page Title': category['page_title'],
                    'Meta Keywords': category['meta_keywords'],
                    'Meta Description': category['meta_description'],
                    'Category Image URL': category['image_url'],
                    'Category Visible': stringToYesNo(category['is_visible']),
                    'Search Keywords': category['search_keywords'],
                    'Default Product Sort': category['default_product_sort'],
                    'Category URL': category['custom_url']['url'],
                    'Custom URL': stringToYesNo(category['custom_url']['is_customized']),
                };
            }
        }

        determinePageForCSV(category_list);

        function sendCSV() {
            csvStream.end();
            writableStream.on('finish', function() {
                console.log('Done with CSV');
                res.download(filename, (err) => {
                    if (err) {
                        console.log(`csv send err: ${err}`);
                    }
                    else {
                        fs.unlink(filename, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log(`${filename} removed after download`);
                        });
                    }
                });
            });
        }
    }
});

//Import a CSV and create categories
let importResults = {started: false};
let cancelled = false;
router.post('/import', upload.single('csvFile'), (req, res) => {
    let hash = req.session.storehash;
    let bc;
    let uploadedCSV = streamifier.createReadStream(req.file.buffer);
    let csvStream = csv;
    let categoryArray = [];

    importResults = {
        created: {
            count: 0,
            messages: []
        },
        updated: {
            count: 0,
            messages: []
        },
        failed: {
            count: 0,
            messages: []
        }, 
        complete: false, 
        started: true,
        progress: [],
        acknowledged: false
    };

    class UploadProcess extends EventEmitter {}
    const uploadProcess = new UploadProcess();

    csvStream
        .fromStream(uploadedCSV, {headers: true})
        .on('error', err => {
            importResults.started = false;
            res.status('400').send('Error: CSV is not in expected format\nCheck instructions for format help.');
        })
        .on('data', data => prepareCategories(data))
        .on('end', () => uploadProcess.emit('done', categoryArray));

    //Convert data from CSV into acceptable format for BC API
    function prepareCategories(data) {
        const newCategory = {
            'parent_id': parseInt(data['Parent ID']) || 0,
            'name': data['Category Name'],
            'description': data['Category Description'],
            'sort_order': parseInt(data['Sort Order']) || 0,
            'page_title': data['Page Title'],
            'meta_keywords': [data['Meta Keywords']],
            'meta_description': data['Meta Description'],
            'image_url': data['Category Image URL'],
            'is_visible': yesNoToBoolean(data['Category Visible']) || true,
            'search_keywords': data['Search Keywords'],
            'default_product_sort': data['Default Product Sort'] || 'use_store_settings'
        };
        if (data['Category URL'] && data['Custom URL']) {
            newCategory['custom_url'] = {
                'url': data['Category URL'],
                'is_customized': yesNoToBoolean(data['Custom URL'])
            };
        }
            
        return categoryArray.push(newCategory);
    }

    uploadProcess.on('done', (categories) => {
        bcAuth(hash)
            .then(data => {
                bc = data;
                initImport(categories);
            })
            .catch(err => console.log(err));
    });

    function initImport(categories) {
        cancelled = false;
        const count = categories.length;
        res.send({'import': 'started'});
        iterateCategories(categories, count - 1, 0);
    }

    function checkForExistingCategory(category) {
        const name = category['name'];
        return bc.get(`/catalog/categories?name=${encodeURIComponent(name)}`);
    }

    function updateExistingCategory(categoryToUpdate, categoryData) {
        return bc.put(`/catalog/categories/${categoryToUpdate['id']}`, categoryData);
    }

    function createNewCategory(category) {
        return bc.post('/catalog/categories', category);
    }

    function iterateCategories(queue, count, index) {
        if (cancelled === true) {
            return false;
        }

        let categoryToImport = queue[index];
        importResults.progress = [`${index < count ? index : count + 1}/${count + 1}`, Math.round(index / count * 100)];

        if (index <= count) {
            checkForExistingCategory(categoryToImport)
                .then(apiResponse => {
                    if (apiResponse.data.length >= 1) {
                        let categoryToUpdate = apiResponse.data.filter(existingCategory => {
                            return existingCategory['parent_id'] == categoryToImport['parent_id'];
                        });
                    
                        // A category with the same name exists but not with the same parent ID
                        if (categoryToUpdate.length < 1) {
                            return createNewCategory(categoryToImport);
                        }
                        return updateExistingCategory(categoryToUpdate[0], categoryToImport);
                    }
                    else { 
                        return createNewCategory(categoryToImport);
                    }
                })
                .then(data => { 
                    importResults.created.count++; 
                    index++;
                    iterateCategories(queue, count, index);
                })
                .catch(err => {
                    console.log(err);
                    let messaging = err.message.toString();
                    let indexer = messaging.indexOf('body:');
                    let newErr = messaging.slice(indexer+5).trim();
                    try {
                        newErr = JSON.parse(newErr).title;
                        let failureMessage = `Error importing ${categoryToImport['name']}: ${newErr}`;
                        importResults.failed.count++;
                        importResults.failed.messages.push(failureMessage);
                        index++;
                    } catch (e) {
                        let failureMessage = `Error importing ${categoryToImport['name']}: Connection error`;
                        importResults.failed.count++;
                        importResults.failed.messages.push(failureMessage);
                        index++;
                    }
                    iterateCategories(queue, count, index);
                });
        }
        else {
            importResults.progress[1] = 100;
            importResults.complete = true;
        }
    }

});

//A route to poll the progress of the import
router.get('/progress', (req, res) => {
    if (process.env.DEVELOPMENT == 'true') {
        importResults.started = true;
    }
    res.send(importResults);
});

router.get('/restart', (req, res) => {
    importResults.started = false;
    res.send({'acknowledged': true});
});

router.get('/cancel', (req, res) => {
    importResults.complete = true;
    return cancelled = true;
})


module.exports = router;
