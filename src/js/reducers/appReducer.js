import {HTTP_ERROR} from "../actions/actionTypes";

//ricordarsi di settare lo stato di default.
/*
  un reducer switcha il tipo di azione e ne ritorna lo stato modificato.
  NBBBB: ricordarsi di utilizzare le assegnazioni degli oggetti (usa Object.assign()) per mantenere i riferimenti degli oggetti altrimenti redux potrebbe non bindare in automatico il cambiamento.
*/
export default (state = { }, action) => {
    switch (action.type) {
      case HTTP_ERROR:
        return Object.assign({}, state, {
          error:action.payload
        });
      default:
        return state;
    }
  }
