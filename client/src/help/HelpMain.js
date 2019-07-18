import { Link } from 'react-router-dom';
import { Table, Card, Button } from 'react-bootstrap';
import backArrow from '../static/left-arrow.svg';

const HelpMain = (props) => {
    const { loadMain } = props;
    return (
        <div>
            
            <article>
                <Card>
                    <Card.Body>
                    <Card.Title>
                        Help
                    </Card.Title>
                    <p>
                    An easy way to start is to export your categories, then build off the exported file.
                    </p>
                    <p>To upload a CSV, you can drag and drop your file or click the upload link.</p>
                    <p>After a file is submitted for import, you can leave the page and come back later to check on the progress.</p>
                    
                    </Card.Body>
                    <Card.Footer>
                    <Link to='/'><Button variant='secondary' onClick={loadMain} className='imgBtn'><img src={backArrow} style={{maxWidth: '32px'}}/><span>Go back</span></Button></Link>
                    </Card.Footer>
                   
                </Card>
                
                <Table>
                    <tbody>
                    <tr>
                        <th>Category ID</th>
                        <td>A unique numerical value that identifies every category.</td>
                    </tr>
                    <tr>
                        <th>Parent ID</th>
                        <td>Leave blank or set to 0 to create a top level category. To create a subcategory, set this to the category ID of the category you want as a parent.</td>
                    </tr>
                    <tr>
                        <th>Category Name</th>
                        <td>Category names must be unique, unless they are on different levels (e.g. parent vs subcategory).</td>
                    </tr>
                    <tr>
                        <th>Category Description</th>
                        <td>On most themes, the category description will appear at the top of the category page. You can use HTML in the description to customize the appearance.</td>
                    </tr>
                    <tr>
                        <th>Sort Order</th>
                        <td>Sets the priority in which the categories are listed; 0 is the default.</td>
                    </tr>
                    <tr>
                        <th>Page Title</th>
                        <td>The title shown in the web browser, as well as the main link text in search engines.</td>
                    </tr>
                    <tr>
                        <th>Meta Keywords</th>
                        <td>Keywords relevant to the product. Separate multiple keywords by commas. Note that keywords are ignored by modern search engines.</td>
                    </tr>
                    <tr>
                        <th>Meta Description</th>
                        <td>A short sentence (150-160 characters) summarizing the content of the category. This can be shown in the search engine results, although some search engines will instead show other content from the page that better matches the user's search query.</td>
                    </tr>
                    <tr>
                        <th>Category Image</th>
                        <td>Set an image to appear on the category page (not supported by all themes).</td>
                    </tr>
                    <tr>
                        <th>Category Visible</th>
                        <td>Set the visibility of a category with <strong>Y</strong> or <strong>N</strong>.</td>
                    </tr>
                    <tr>
                        <th>Search Keywords</th>
                        <td>Product keywords to assist in your store's search.</td>
                    </tr>
                    <tr>
                        <th>Default Product Sort</th>
                        <td>This determines the order in which products are displayed on category pages. Available values: 
                            <ul>
                                <li>use_store_settings</li>
                                <li>featured</li>
                                <li>newest</li>
                                <li>best_selling</li>
                                <li>alpha_asc</li>
                                <li>alpha_desc</li> 
                                <li>avg_customer_review</li>
                                <li>price_asc</li>
                                <li>price_desc</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Category URL</th>
                        <td>The category URL, excluding the store domain</td>
                    </tr>
                    <tr>
                        <th>Custom URL</th>
                        <td>Set to <strong>Y</strong> or <strong>N</strong> to indicate this is a custom URL instead of one generated by the store</td>
                    </tr>
                    </tbody>
                </Table>
            </article>
        </div>        
    )
}

export default HelpMain;