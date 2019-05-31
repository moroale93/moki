import {UPDATE_PROJECTS, ADD_SERVICES, ADD_PROJECT, CHANGE_LOADING_PROJECTS, CHANGE_LOADING_SERVICES, UPDATE_SERVICES, DELETE_PROJECTS, DELETE_SERVICE} from "./actionTypes";
import {showError} from './appActions';

const isLocal=true;
let baseUrl=isLocal?"http://localhost:9080":""

export const addService= (idProject, service) =>{
    return  (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_SERVICES,
            payload: { idProject, loading: true }
        });
        fetch(baseUrl+"/projects/"+idProject+"/services", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        })
        .then((response)=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(()=>{
            dispatch({
                type:ADD_SERVICES,
                payload: {service, idProject}
            });
            dispatch(updateServices(idProject));
        })
        .catch(()=>{
            dispatch(showError("Errore inaspettato..."));
        })
        .finally(()=>{
            dispatch({
                type: CHANGE_LOADING_SERVICES,
                payload: { idProject, loading: false }
            });
        });
    }
};

export const addProject= (project) =>{
    return  (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_PROJECTS,
            payload: true
        });
        fetch(baseUrl+"/projects", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((response)=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(()=>{
            dispatch({
                type: ADD_PROJECT,
                payload: project
            });
            dispatch(updateProjects());
        })
        .catch(()=>{
            dispatch(showError("Errore inaspettato..."));
        })
        .finally(()=>{
            dispatch({
                type: CHANGE_LOADING_PROJECTS,
                payload: false
            });
        });
    }
};

export const updateProjects = (callback)=>{
    return  (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_PROJECTS,
            payload: true
        });
        fetch(baseUrl+"/projects")
        .then((response)=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((projects)=>{
            dispatch({
                type: UPDATE_PROJECTS,
                payload: projects
            });
            /*projects.forEach(post => {
                dispatch(updateComments(post.id));
            });*/
        })
        .catch(()=>{
            dispatch(showError("Errore inaspettato..."));
        })
        .finally(()=>{
            dispatch({
                type: CHANGE_LOADING_PROJECTS,
                payload: false
            });
            if(callback){
                callback();
            }
        });
    }
};

export const deleteProject = (idProject)=>{
    return  (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_PROJECTS,
            payload: true
        });
        fetch(baseUrl+"/projects/"+idProject, {
            method: 'DELETE'
        })
        .then((response)=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(()=>{
            dispatch({
                type: DELETE_PROJECTS,
                payload: {idProject}
            });
            dispatch(updateProjects());
        })
        .catch(()=>{
            dispatch(showError("Errore inaspettato..."));
        })
        .finally(()=>{
            dispatch({
                type: CHANGE_LOADING_PROJECTS,
                payload: false
            });
        });
    }
};

export const updateServices = (idProject)=>{
    return  (dispatch, state) => {
        if(state().projectData.projects.length){
            dispatch({
                type: CHANGE_LOADING_SERVICES,
                payload: { idProject, loading: true }
            });
            fetch(baseUrl+"/projects/"+idProject+"/services")
            .then((response)=>{
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((services)=>{
                dispatch({
                    type: UPDATE_SERVICES,
                    payload: { idProject, services }
                });
            })
            .catch(()=>{
                dispatch(showError("Errore inaspettato..."));
            })
            .finally(()=>{
                dispatch({
                    type: CHANGE_LOADING_SERVICES,
                    payload: { idProject, loading: false }
                });
            });
        }else{
            dispatch(updateProjects(()=>{
                dispatch(updateServices(idProject));
            }));
        }
    }
};


export const deleteService = (idProject, idService)=>{
    return  (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_SERVICES,
            payload: { idProject, loading: true }
        });
        fetch(baseUrl+"/projects/"+idProject+"/services/"+idService, {
            method: 'DELETE'
        })
        .then((response)=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(()=>{
            dispatch({
                type: DELETE_SERVICE,
                payload: { idProject, idService }
            });
            dispatch(updateServices());
        })
        .catch(()=>{
            dispatch(showError("Errore inaspettato..."));
        })
        .finally(()=>{
            dispatch({
                type: CHANGE_LOADING_SERVICES,
                payload: { idProject, loading: false }
            });
        });
    }
};


export const editService = (idProject, service)=>{
    return  (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_SERVICES,
            payload: { idProject, loading: true }
        });
        fetch(baseUrl+"/projects/"+idProject+"/services/"+service.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        })
        .then((response)=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(()=>{
            dispatch(updateServices());
        })
        .catch(()=>{
            dispatch(showError("Errore inaspettato..."));
        })
        .finally(()=>{
            dispatch({
                type: CHANGE_LOADING_SERVICES,
                payload: { idProject, loading: false }
            });
        });
    }
};