import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import questionSVG from '../static/question-mark.svg';

const HelpCard = () => {
  return (
    <Card bg="success" text="white">
      <Link to='/help' style={{height: '100%'}}>
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
            <Card.Img src={questionSVG} style={{width: '50%'}}/>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>Help</Card.Title>
          <Card.Footer>Learn about importing and exporting categories</Card.Footer>
        </Card.Body>
        </Link>
    </Card>
  )
}

export default HelpCard;