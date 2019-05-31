import {CHANGE_LOGGED_USER} from "./actionTypes";

//esempio di azione da eseguire al cambiamento dell'utente loggato
export const changeLoggedUser = (user)=>({
    type: CHANGE_LOGGED_USER,
    payload: user
});