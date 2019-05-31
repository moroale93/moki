import React, { Component } from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import './serviceEditor.css';

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
    <div title={(touched[field.name] && field.value!=="" && !JsonValid(field.value)) ?"Json not valid" : ""}
      className={(touched[field.name] && field.value!=="" && !JsonValid(field.value))? "not-valid":""}>
      <textarea {...field} {...props}></textarea>
    </div>
  </div>
);

export class ServiceEditor extends Component {
  constructor(props){
    super(props);
    console.log(props)
    this.state={
      isAdd: props.defaultVal===undefined,
      defaultService: props.defaultVal?props.defaultVal:{description:"", endpoint:"", method:"GET", successBody:"", respError:false, errorCode:500, errorBody:""}
    }
  }

  onAddService=(service, { setSubmitting })=>{
    this.props.callback(Object.assign({},service));
    if(this.state.isAdd){
      service=this.state.defaultService
    }
    setSubmitting(false);
  }

  render(){
    return (
      <div>
        <Formik initialValues={this.state.defaultService} validationSchema={ServiceValidationSchema} onSubmit={this.onAddService}>
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
                {this.state.isAdd?"Add service":"Save"}
              </button>
              <div className="clearfix"></div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default ServiceEditor;