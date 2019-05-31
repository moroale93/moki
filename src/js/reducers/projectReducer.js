import {UPDATE_PROJECTS, ADD_SERVICES, ADD_PROJECT, CHANGE_LOADING_PROJECTS, CHANGE_LOADING_SERVICES, UPDATE_SERVICES, DELETE_PROJECTS, DELETE_SERVICE} from "../actions/actionTypes";

//ricordarsi di settare lo stato di default.
/*
  un reducer switcha il tipo di azione e ne ritorna lo stato modificato.
  NBBBB: ricordarsi di utilizzare le assegnazioni degli oggetti (usa Object.assign()) per mantenere i riferimenti degli oggetti altrimenti redux potrebbe non bindare in automatico il cambiamento.
*/
export default (state = { projects: [], loadingProjects: false }, action) => {
    let idProject = null;
    switch (action.type) {

      case UPDATE_PROJECTS:
        return Object.assign({}, state, {
          projects:action.payload
        });

        case ADD_SERVICES:
          const {service} = action.payload;
          idProject = action.payload.idProject;
          return Object.assign({}, state, {
            projects: state.projects.map(function(project){
              if(project.id===idProject){
                return Object.assign({},project,{
                  service: [
                    ...project.service || [],
                    service
                  ]
                });
              }
              return project;
            })
          });

          case DELETE_SERVICE:
            const {idService} = action.payload;
            idProject = action.payload.idProject;
            return Object.assign({}, state, {
              projects: state.projects.map(function(project){
                if(project.id===idProject){
                  return Object.assign({},project,{
                    service: [
                      ...project.service.filter((service)=> service.id!==idService)
                    ]
                  });
                }
                return project;
              })
            });

      case ADD_PROJECT:
        return Object.assign({}, state, {
          projects: [
            action.payload,
            ...state.projects || []
          ]
        });

      case DELETE_PROJECTS:
        return Object.assign({}, state, {
          projects: [
            action.payload,
            ...state.projects.filter((project)=>project.id===action.payload.idProject) || []
          ]
        });
      case CHANGE_LOADING_PROJECTS:
        return Object.assign({}, state, {
          loadingProjects: action.payload
        });

      case CHANGE_LOADING_SERVICES:
        idProject = action.payload.idProject;
        const {loading} = action.payload;
        return Object.assign({}, state, {
          projects: state.projects.map(function(project){
            if(project.id===idProject){
              return Object.assign({},project,{
                loadingServices:loading
              });
            }
            return project;
          })
        });

      case UPDATE_SERVICES:
        idProject = action.payload.idProject;
        const {services} = action.payload;
        return Object.assign({}, state, {
          projects: state.projects.map(function(project){
            if(project.id===idProject){
              return Object.assign({},project,{
                services
              });
            }
            return project;
          })
        });
      default:
        return state;
    }
  }
