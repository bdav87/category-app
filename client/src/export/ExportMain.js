import { Link } from 'react-router-dom';
import { Row, Col, Button, Card } from 'react-bootstrap';
import backArrow from '../static/left-arrow.svg';
import download from '../static/download.svg';

const initDownload = () => {
    return window.location = '/api/export';
}
const ExportMain = (props) => {
    return (
        <div className='exportContainer'>
            <Card>
                <Card.Body className='exportCardBody'>
                    <Card.Text>
                    Navigate to the main page.
                    </Card.Text>
                    <Link to='/'>
                        <Button variant='info' className='imgBtn'>
                            <img src={backArrow} style={{maxWidth: '32px'}}/><span>Go back </span>
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
            
            <Card style={{maxWidth: '384px'}}>
                <Card.Body className='exportCardBody'>
                    <Card.Text>
                    <p>Click<strong> Download CSV </strong> 
                    to export your categories to a CSV file and download it to your computer.
                    </p>
                    </Card.Text>
                    <Button 
                        variant='danger' 
                        onClick={initDownload}
                        className='imgBtn'>
                        <img src={download} style={{maxWidth: '32px'}}/> 
                        Download CSV
                    </Button>
                </Card.Body>
            </Card>        
        </div>
    )
}

export default ExportMain;