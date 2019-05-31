import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateServices, deleteService, addService} from '../../actions/projectActions';
import ServiceEditor from "../serviceEditor/serviceEditor";
import './project.css';

export class Project extends Component {
  componentDidMount(){
    this.props.updateServices(this.props.match.params.id);
  }

  onDeleteService=(service)=>()=>{
    this.props.deleteService(this.props.project.id, service.id);
  }

  onViewService=(service)=>()=>{
    this.props.history.push("/"+this.props.project.id+"/services/"+service.id);
  }

  updateServices=()=>{
    this.props.updateServices(this.props.project.id);
  }

  changeRespWithError=(service)=>(e)=>{
    console.log("Cambio resp with error", service.id, e.target.value);
  }

  onAddService=(service)=>{
    this.props.addService(this.props.project.id, service);
  }

  render(){
    const {loading, error, project}=this.props;
    const servicesList=this.props.services.map((service, index)=><li key={index}>
      <div className="description">{service.description}</div>
      <div className="method">{`${service.method}`}</div>
      <div className="endpoint">{`/mocks/${project.baseEndpoint}/${service.endpoint}`}</div>
      <div className="respError"><label>Response with error<input type="checkbox" checked={service.respError} onChange={this.changeRespWithError(service)}></input></label></div>
      <div><button onClick={this.onDeleteService(service)}>Delete</button></div>
      <div><button onClick={this.onViewService(service)}>Edit responses</button></div>
    </li>);
    return (
      <div className="App">
        <ServiceEditor callback={this.onAddService}></ServiceEditor>
        <button className="refresh" onClick={this.updateServices}>Refresh</button>
        <div className="clearfix"></div>
        <div className="post-wrapper">
          {loading && <div className="loading"><div className="lds-ripple"><div></div><div></div></div></div>}
          {(servicesList.length? <ul>{servicesList}</ul>:null) || (!loading && <h2>No services</h2>)}
          <div className="clearfix"></div>
        </div>
        <div className={"toast" + (error?" show":"")}><div className="img"><i className="fas fa-exclamation-triangle"></i></div><div className="desc">{error}</div></div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let project =state.projectData.projects.filter((project)=>project.id===props.match.params.id);
  project= project.length?project[0]:undefined;
  let services = [];
  if(project && project.services){
    services=project.services;
  }
  return {
    project: project,
    services: services,
    loading: project?project.loadingServices:false,
    error: state.appData.error
  };
};

const mapDispatchToProps = {
  updateServices,
  deleteService,
  addService
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);