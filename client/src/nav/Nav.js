import { CardDeck } from 'react-bootstrap';
import ImportCard from '../import/ImportCard';
import ExportCard from '../export/ExportCard';
import HelpCard from '../help/HelpCard';

const Nav = (props) => {
    return (
        <CardDeck>
          <ExportCard />
          <ImportCard />
          <HelpCard loadHelp={props.loadHelp}/>
      </CardDeck>
    )
}

export default Nav;