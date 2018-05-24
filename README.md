# Category Importer and Exporter

Imports new categories into a BigCommerce store using CSV spreadsheets.

Exports a store's entire collection of categories and provides CSV files for download.

## Importing Categories
When importing new categories, these CSV headers must be present exactly as written and in the order listed here:

- id
- parent_id
- name
- description
- sort_order
- page_title
- meta_keywords
- meta_description
- image_url
- is_visible
- search_keywords

The **id** values are currently ignored - in the future this can be used to update existing categories.

To ensure a new category is created, you need to set the **parent_id** to 0 and provide a unique **name**.

To create subcategories, use the **parent_id** of an existing category. Exporting the store categories is an easy way to get the **parent_id** of a category.

CSV files are limited to 1 MB in size. A CSV that large is capable of creating several thousand categories. If you accidentally upload a file that's too big the app will let you know right away and take you back to the beginning.

----

### Features
- HTML is accepted in the category description.

- To upload a CSV, you can drag and drop your file from your computer or click the upload link.

- If you accidentally dropped the wrong file in, don't worry! You can hit cancel and select a different file instead. 

- The app detects if a file is in the wrong format and notifies the user instead of attempting import.

- When a file is submitted for import, you can leave the page and come back later to check on the progress.

----

## Exporting categories

Exporting categories is as easy as navigating to the export area and pressing the export button. A CSV file will be downloaded to your computer. 

This includes more data than what's accepted by the importer, so you need to make the headers match per the instructions above if you want to import the file.