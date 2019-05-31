import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateServices,editService} from '../../actions/projectActions';
import ServiceEditor from "../serviceEditor/serviceEditor";
import './service.css';

export class Service extends Component {
  componentDidMount(){
    this.props.updateServices(this.props.match.params.id);
  }

  onEditService=(service)=>{
    this.props.editService(this.props.project.id, service);
  }

  render(){
    const {service}=this.props;
    return (
      <div>
        {service && <ServiceEditor defaultVal={service} callback={this.onEditService}></ServiceEditor>}
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
  updateServices,
  editService
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);