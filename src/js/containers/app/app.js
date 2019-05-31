import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateProjects, deleteProject, addProject} from '../../actions/projectActions';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import './app.css';

const ProjectValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  baseEndpoint: Yup.string()
    .min(2, 'Too Short!')
    .required('Required')
});

export class App extends Component {
  componentDidMount(){
    this.props.updateProjects();
  }

  onDelete=(project)=>()=>{
    this.props.deleteProject(project.id);
  }

  onViewServices=(project)=>()=>{
    this.props.history.push("/"+project.id);
  }

  onAddProject=(project, { setSubmitting })=>{
    this.props.addProject(project);
    project.name="";
    project.baseEndpoint="";
    setSubmitting(false);
  }

  render(){
    const projectsList=this.props.projects.map((project, index)=><li key={index}>
      <div>{project.name}</div>
      <div>/{project.baseEndpoint}</div>
      <div><button onClick={this.onDelete(project)}>Delete</button></div>
      <div><button onClick={this.onViewServices(project)}>View services</button></div>
    </li>);
    const {updateProjects, loading, error}=this.props;
    return (
      <div className="App">
         <Formik initialValues={{name:"", baseEndpoint:""}} validationSchema={ProjectValidationSchema} onSubmit={this.onAddProject}>
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field type="text" name="name" placeholder="Project name" autoComplete="off" />
              {errors.name && touched.name ? (<div className="val-error">{errors.name}</div>) : null}
              
              <Field type="text" name="baseEndpoint" placeholder="Base endpoint" autoComplete="off" />
              {errors.baseEndpoint && touched.baseEndpoint ? (<div className="val-error">{errors.baseEndpoint}</div>) : null}
              
              <button type="submit" disabled={isSubmitting}>
                Add project
              </button>
              <div className="clearfix"></div>
            </Form>
          )}
        </Formik>
        
        <button className="refresh" onClick={updateProjects}>Refresh</button>
        <div className="clearfix"></div>
        <div className="post-wrapper">
          {loading && <div className="loading"><div className="lds-ripple"><div></div><div></div></div></div>}
          {(projectsList.length? <ul>{projectsList}</ul>:null) || (!loading && <h2>No projects</h2>)}
        </div>
        <div className={"toast" + (error?" show":"")}><div className="img"><i className="fas fa-exclamation-triangle"></i></div><div className="desc">{error}</div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.projectData.projects,
  loading: state.projectData.loadingProjects,
  error: state.appData.error
});

const mapDispatchToProps = {
  updateProjects,
  deleteProject,
  addProject
};

export default connect(mapStateToProps, mapDispatchToProps)(App);