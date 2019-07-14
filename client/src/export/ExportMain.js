import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const ExportMain = (props) => {
    return (
        <div>
            <h1>Export categories</h1>
            <Link to='/'><Button variant='info'>Go back</Button></Link>
        </div>
    )
}

export default ExportMain;