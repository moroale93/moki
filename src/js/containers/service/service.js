import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateServices} from '../../actions/projectActions';
import './service.css';

export class Service extends Component {
  componentDidMount(){
    console.log(this.props.match.params)
    this.props.updateServices(this.props.match.params.id);
  }

  changeFiled=(e)=>{
    console.log("Cambio resp with error", this.props.service.id, e.target.name, e.target.type==="checkbox"?e.target.checked:e.target.value);
  }

  render(){
    const {loading, error, project,service}=this.props;
    return (
      <div className="App">
        <button className="refresh" onClick={this.updateServices}>Refresh</button>
        <div className="clearfix"></div>
        <div className="post-wrapper">
          {loading && <div className="loading"><div className="lds-ripple"><div></div><div></div></div></div>}
          {service && <div>
            <div className="description">{service.description}</div>
            <div className="method">{`${service.method}`}</div>
            <div className="endpoint">{`/mocks/${project.baseEndpoint}/${service.endpoint}`}</div>
            <div className="respError"><label>Response with error<input type="checkbox" value={service.respError} name="respError" onChange={this.changeFiled}></input></label></div>
            <div><label>Success response<textarea value={JSON.stringify(service.successBody)} name="successBody" onChange={this.changeFiled}></textarea></label></div>
            <div><label>Error response<textarea value={JSON.stringify(service.errorBody)} name="errorBody" onChange={this.changeFiled}></textarea></label></div>
            <div className="clearfix"></div>
          </div>}
        </div>
        <div className={"toast" + (error?" show":"")}><div className="img"><i className="fas fa-exclamation-triangle"></i></div><div className="desc">{error}</div></div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let project =state.projectData.projects.filter((project)=>project.id===props.match.params.id);
  project= project.length?project[0]:undefined;
  let service = undefined;
  if(project && project.services){
    service=project.services.filter((serviceEl)=>serviceEl.id===props.match.params.idService);
    service = service.length?service[0]:undefined;
  }
  return {
    project: project,
    service: service
  };
};

const mapDispatchToProps = {
  updateServices
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);