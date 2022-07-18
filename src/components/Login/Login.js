import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import AuthContext from '../../store/auth-context';

const emailReducer = ( state, action ) => {
  if(action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes('@') }
  }
  if(action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: false}
};

const passwordReducer = (state, action ) => {
  if(action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 }
  }
  if(action.type === "INPUT_BLUR" ) {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }
  return { value: '', isValid: false};
}

const Login = (props) => {
  
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);


  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null
  });

  const [passwordState, dispatchPassowrd] = useReducer(passwordReducer, {
      value: "",
      isValid: null
  });
  
  const ctxAuth = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  //object destructuring
  const { isValid: isEmailVlid } = emailState;
  const { isValid: isPasswordlVlid } = passwordState;

  useEffect( () => {

    const identifier = setTimeout(() => {

      setFormIsValid(
        isEmailVlid && isPasswordlVlid
      );
    }, 500)

    return () => {
      console.log("Clear")
      clearTimeout(identifier);
    }

   }, [isEmailVlid, isPasswordlVlid])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value});
    //setEnteredEmail(event.target.value);

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassowrd({type: "USER_INPUT", val: event.target.value});
    //setEnteredPassword(event.target.value);

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR"});
    //setEmailIsValid(emailState.isValid);
  };

  const validatePasswordHandler = () => {
    dispatchPassowrd({type: "INPUT_BLUR"});
    //setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) {
      ctxAuth.onLogin(emailState.value, passwordState.value);
    } else if(!emailState.isValid) {
        emailInputRef.current.focus();
    }
    else if(!passwordState.isValid) {
      passwordInputRef.current.focus();
    }
  };

  

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        
          <Input type="email" id="email" label="E-Mail" value={emailState.value} isValid={emailState.isValid} changeHandler={emailChangeHandler} validateHandler={validateEmailHandler} ref={emailInputRef}/>
          {/* <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          /> */}
        
          <Input type="password" id="password" label="Password" value={passwordState.value} isValid={passwordState.isValid} changeHandler={passwordChangeHandler} validateHandler={validatePasswordHandler} ref={passwordInputRef}/>
          {/* <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          /> */}
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
