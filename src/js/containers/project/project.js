import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateServices, deleteService, addService} from '../../actions/projectActions';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import './project.css';

const ServiceValidationSchema = Yup.object().shape({
  description: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  endpoint: Yup.string()
    .min(2, 'Too Short!')
    .required('Required'),
  method: Yup.string()
    .oneOf(["GET", "POST", "DELETE", "PUT"], 'Insert a valid method!')
    .required('Required'),
  successBody: Yup.string()
    .min(2, 'Too Short!'),
  respError: Yup.boolean(),
  errorCode: Yup.number()
    .positive('The code must be positive!')
    .required('Required'),
  errorBody: Yup.string()
    .min(2, 'Too Short!')
});

const JsonValid = (jsonString)=>{
	try{
		JSON.parse(jsonString);
		return true;
	}catch(e){
		return false
	}
}

const JsonEditorComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <div className="json-editor">
    <div title={touched[field.name] && field.value!=="" && !JsonValid(field.value) && "Json not valid"}
      className={touched[field.name] && field.value!=="" && !JsonValid(field.value) && "not-valid"}>
      <textarea {...field} {...props}></textarea>
    </div>
  </div>
);

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

  onAddService=(service, { setSubmitting })=>{
    this.props.addService(this.props.project.id, service);
    service.description="";
    service.endpoint="";
    service.method="GET";
    service.successBody="";
    service.respError=false;
    service.errorCode=500;
    service.errorBody="";
    setSubmitting(false);
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
        <Formik initialValues={{description:"", endpoint:"", method:"GET", successBody:"", respError:false, errorCode:500, errorBody:""}} validationSchema={ServiceValidationSchema} onSubmit={this.onAddService}>
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field type="text" name="description" placeholder="Project description" autoComplete="off" />
              {errors.description && touched.description ? (<div className="val-error">{errors.description}</div>) : null}

              <Field type="text" name="endpoint" placeholder="Endpoint" autoComplete="off" />
              {errors.endpoint && touched.endpoint ? (<div className="val-error">{errors.endpoint}</div>) : null}
              
              <Field component="select" name="method" placeholder="Method" autoComplete="off" >
                <option value="GET">Get</option>
                <option value="POST">Post</option>
                <option value="DELETE">Delete</option>
                <option value="PUT">Put</option>
              </Field>
              {errors.method && touched.method ? (<div className="val-error">{errors.method}</div>) : null}
              
              <Field component={JsonEditorComponent} name="successBody" placeholder="Success body" autoComplete="off" />
              {errors.successBody && touched.successBody ? (<div className="val-error">{errors.successBody}</div>) : null}
              
              <Field type="checkbox" name="respError" placeholder="Response with error" autoComplete="off" />
              {errors.respError && touched.respError ? (<div className="val-error">{errors.respError}</div>) : null}
              
              <Field type="number" name="errorCode" placeholder="Error code" autoComplete="off" />
              {errors.errorCode && touched.errorCode ? (<div className="val-error">{errors.errorCode}</div>) : null}
              
              <Field component={JsonEditorComponent} name="errorBody" placeholder="Error body" autoComplete="off" />
              {errors.errorBody && touched.errorBody ? (<div className="val-error">{errors.errorBody}</div>) : null}
              
              <button type="submit" disabled={isSubmitting}>
                Add service
              </button>
              <div className="clearfix"></div>
            </Form>
          )}
        </Formik>
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