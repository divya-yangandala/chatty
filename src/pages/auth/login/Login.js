import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { FaArrowRight } from 'react-icons/fa';
import '@pages/auth/login/Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/utils.service';
import useSessionStorage from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const result = await authService.signIn({
        username,
        password
      });
      // 1 - set logged in to true in local storage
      setLoggedIn(keepLoggedIn);
      // 2 - set username in local storage
      setStoredUsername(username);
      // 3 - dispatch user to redux
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
      setLoading(false);
      // setUser(result.data.user);
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
      navigate('/app/social/streams');
      console.log('navigate to streams page from Login page');
      setLoading(false);
    }
  }, [loading, user, navigate]);

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
            <Input id="checkbox" type="checkbox" name="checkbox" value={keepLoggedIn} handleChange={() => setKeepLoggedIn(!keepLoggedIn)}/>
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
