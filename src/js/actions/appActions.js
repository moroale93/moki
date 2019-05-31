import {HTTP_ERROR} from "./actionTypes";

export const showError = (err)=>{
    return  (dispatch) => {
        dispatch({
            type: HTTP_ERROR,
            payload: err
        });
        setTimeout(()=>{
            dispatch({
                type: HTTP_ERROR,
                payload: null
            });
        }, 5000);
    }
};