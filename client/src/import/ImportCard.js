import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import importSVG from '../static/import.svg';

const ImportCard = () => {
    return (
        <Card bg="info" text="white">
        <Link to='/import' style={{height: '100%'}}>
          <Card.Header>
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
                <Card.Img src={importSVG} style={{width: '50%'}}/>
              </div>
          </Card.Header>
              <Card.Body>
                <Card.Title>Import Categories</Card.Title>
                <Card.Footer>Upload your CSV file to create and update categories</Card.Footer>
              </Card.Body>
              </Link>
        </Card>
    )
}

export default ImportCard;