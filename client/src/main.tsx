import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss';
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from './Redux/store';
import {NavbarContextProvider} from "./Context/NavbarContext";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <NavbarContextProvider>
                <Router>
                    <App/>
                </Router>
            </NavbarContextProvider>
        </Provider>
    </React.StrictMode>
)
