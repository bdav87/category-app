import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import downloadSVG from '../static/download.svg';

const ExportCard = () => {
        return (
        <Card bg="primary" text="white">
            <Link to='/export' style={{height: '100%'}}>
            <Card.Header >
                <div style={{
                background: 'rgba(135, 233, 254, 0.33)',
                borderRadius: '50%',
                width: '166px',
                height: '166px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1px 1px 5px #0000001a'
                }}>
                <Card.Img src={downloadSVG} style={{width: '50%'}}/>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Title>Export Categories</Card.Title>
                <Card.Footer>Download a CSV file with your category details</Card.Footer>
            </Card.Body>
            </Link>
        </Card>
    )
}

export default ExportCard;