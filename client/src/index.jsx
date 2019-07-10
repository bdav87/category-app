import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = document.getElementById('root');
const load = () => render((
    <AppContainer>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </AppContainer>
), root);

if (module.hot) {
    module.hot.accept('./App', load);
}

load();
