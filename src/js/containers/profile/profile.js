import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {changeLoggedUser} from '../../actions/authActions';
import './profile.css';

const ProfileValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
});

export class Profile extends Component {
  onLogin= (values, { setSubmitting }) => {
    if(values.isLogged ){
      values.firstName="";
      values.lastName="";
      values.email="";
    }
    values.isLogged=!values.isLogged;
    this.props.changeLoggedUser(values);
    setSubmitting(false);
  }

  render(){
    return (
      <div className="App">
        <Formik initialValues={this.props.loggedUser} validationSchema={ProfileValidationSchema} onSubmit={this.onLogin}>
          {({ values, isSubmitting, errors, touched }) => (
            <Form>
              <Field type="text" name="firstName" placeholder="First name" autocomplete="off" {...{readOnly:values.isLogged}} />
              {errors.firstName && touched.firstName ? (<div className="val-error">{errors.firstName}</div>) : null}
              
              <Field type="text" name="lastName" placeholder="Last name" autocomplete="off" {...{readOnly:values.isLogged}} />
              {errors.lastName && touched.lastName ? (<div className="val-error">{errors.lastName}</div>) : null}
              
              <Field type="email" name="email" placeholder="Email" autocomplete="off" {...{readOnly:values.isLogged}} />
              {errors.email && touched.email ? <div className="val-error">{errors.email}</div> : null}

              {!values.isLogged && 
                <button type="submit" disabled={isSubmitting}>
                  Login
                </button>
              }
              {values.isLogged && 
                <button type="submit" disabled={isSubmitting}>
                  Logout
                </button>
              }
              <div class="clearfix"></div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loggedUser: state.authData.loggedUser
});

const mapDispatchToProps = {
  changeLoggedUser: changeLoggedUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);