import 'react-app-polyfill/ie9';//include il supporto a IE
import 'react-app-polyfill/stable';//include il supporto a IE
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import App from './js/containers/app/app'
import Project from './js/containers/project/project'
import Service from './js/containers/service/service'
import Profile from './js/containers/profile/profile'
import reducer from './js/reducers/index'
import * as serviceWorker from './serviceWorker'
import './styles/style.scss'

const middleware = [ thunk ];//thunk serve per gestire le azioni asincrone (come per esempio le chimate ai servizi)
const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});//questo serve per poter utilizzare l'estensione di chrome per il debug delle azioni e stato (redux)

if (process.env.NODE_ENV !== 'production') {  
  middleware.push(createLogger())
}

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
); // crea lo store redux

//renderizzo l'applicazione nell'elemento #root che si trova nell'index.html
ReactDOM.render(
    <Provider store={store}>
      <Router>
        <nav>
          <ul>
            <li className="brand">
                <NavLink to="/">
                    Moki
                </NavLink>
            </li>
            <li>
                <NavLink to="/">
                    Projects
                </NavLink>
            </li>
          </ul>
        </nav>
        <div className="homepage">
          <Route path="/" exact component={App}/>
          <Route path="/:id" exact component={Project}/>
          <Route path="/:id/services/:idService" exact component={Service}/>
          <Route path="/profile" exact component={Profile}/>
        </div>
      </Router>
    </Provider>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();