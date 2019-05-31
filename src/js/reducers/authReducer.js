import {CHANGE_LOGGED_USER} from "../actions/actionTypes";

export default (state = { loggedUser: { firstName:"", lastName:"", email:"", isLogged:false} }, action) => {
    switch (action.type) {
      case CHANGE_LOGGED_USER:
        return Object.assign({}, state, {
          loggedUser:action.payload
        });
      default:
        return state;
    }
  }
