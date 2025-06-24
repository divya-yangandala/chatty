import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import { FaArrowRight } from 'react-icons/fa';
import './Login.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../../../services/api/auth/auth.service';


const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();

  const loginUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const result = await authService.signIn({
        username,
        password
      });
      // 1 - set logged in to true in local storage
      // 2 - set username in local storage
      // 3 - dispatch user to redux
      setLoading(false);
      setUser(result.data.user);
      setHasError(false);
      setAlertType('alert-success');
    } catch (error) {
      console.log(66666, error);
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data.message);
    }
  }

  useEffect(() => {
    if (loading && !user) return;
    if (user) {
      // navigate to first page
      console.log('navigate to streams page from Login page');
      setLoading(false);
    }
  }, [loading, user]);

  return (
    <div className="auth-inner">
      { hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      ) }
      <form className="auth-form" onSubmit={loginUser}>
        <div className="form-input-container">
          {/* username field */}
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            labelText="Username"
            placeHolder="Enter Username"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            // className={hasError ? '1px solid #fa9b8a' : ''}
            handleChange={(event) => setUsername(event.target.value)}
          />

          {/* password field */}
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            labelText="Password"
            placeHolder="Enter Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event) => setPassword(event.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            {/* <input id="checkbox" type="checkbox" name="checkbox" /> */}
            <Input id="checkbox" type="checkbox" name="checkbox" value={false} handleChange={() => setKeepLoggedIn(!keepLoggedIn)}/>
            Keep me signed in
          </label>
        </div>
        {/* button component */}
        <Button label={loading ? 'SIGNIN IN PROGRESS...' : 'SIGNIN'} className="auth-button button" disabled={!username || !password} />

        <Link to={'/forgot-password'}>
          <span className="forgot-password">Forgot password?
            <FaArrowRight className='arrow-right' />
          </span>
        </Link>
      </form>
    </div>
  );
}

export default Login
