import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import appReducer from "./appReducer";

//se ho più argomenti diversi da storare nello store redux è buona norma organizzare lo stato in oggetti differenti e quindi mi creo un reducer dedicato per ognuno di questi.
//authData in questo caso è l'oggetto in cui verrà settato lo stato settato dal authReducer. Questo conterrà tutti i valori relativi all'autenticazione dell'utente per es
const rootReducer = combineReducers({
  authData:authReducer,
  projectData:projectReducer,
  appData:appReducer
})
  
export default rootReducer