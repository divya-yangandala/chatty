
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import './Register.scss';

const Register = () => {
  return (
    <div className="auth-inner">
      <div className="alerts alert-success" role="alert">
        Error message
      </div>
      <form className="auth-form">
        <div className="form-input-container">
          {/* username field */}
          <Input
            id="username"
            name="username"
            type="text"
            value="my value"
            labelText="Username"
            placeHolder="Enter Username"
            handleChange={() => {}}
          />

           <Input
            id="email"
            name="email"
            type="text"
            value="tester@test.com"
            labelText="Email"
            placeHolder="Enter Email"
            handleChange={() => {}}
          />

          {/* password field */}
          <Input
            id="password"
            name="password"
            type="password"
            value="my password"
            labelText="Password"
            placeHolder="Enter Password"
            handleChange={() => {}}
          />
        </div>
        {/* button component */}
        <Button label={'SIGN UP'} className="auth-button button" disabled={true} />

      </form>
    </div>
  );
}

export default Register;
