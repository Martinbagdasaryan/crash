import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SocketProvider } from './socket/SocketContext.js';
import { Provider } from 'react-redux';
import { store } from './redux/selects/store.js';
import './index.css';
import { StrictMode } from 'react';
import { I18nProvider } from './lang/index.js';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<StrictMode>
		<Provider store={store}>
			<SocketProvider>
				<I18nProvider>
					<App />
				</I18nProvider>
			</SocketProvider>
		</Provider>
	</StrictMode>,
);
