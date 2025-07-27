import { server } from '@mocks/server';
import { signUpMockError } from '@mocks/handlers/auth';
import Register from '@pages/auth/register/Register';
import { render, screen, prettyDOM, waitFor, act } from '@root/test.utils';
// import { authService } from '@services/api/auth/auth.service';
import { Utils } from '@services/utils/utils.service';
import userEvent from '@testing-library/user-event';
import { jest } from 'config-overrides';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}))

describe('Register', () => {
  it('signup should have its labels', () => {
    render(<Register />);
    const usernameLabel = screen.getByLabelText('Username');
    const emailLabel = screen.getByLabelText('Email');
    const passwordLabel = screen.getByLabelText('Password');

    expect(usernameLabel).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  describe('Button', () => {
    it('should be disabled', () => {
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled with input values', () => {
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'divi');
      userEvent.type(emailLabel, 'divi@test.com');
      userEvent.type(passwordLabel, '123456');
      expect(buttonElement).toBeEnabled()
    })

    it('should change label when clicked', async () => {
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      // jest.spyon(authService, 'signUp').mockReturnValue({})
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'divi');
      userEvent.type(emailLabel, 'divi@test.com');
      userEvent.type(passwordLabel, '123456');
      console.log(prettyDOM(buttonElement));
      userEvent.click(buttonElement);

      await act(() => {
        userEvent.click(buttonElement);
      })

      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        console.log(prettyDOM(newButtonElement));
        expect(newButtonElement.textContent).toEqual('SIGNUP IN PROGRESS...');
      })
    })
  })

  describe('Success', () => {
    it('should navigate to streams page', async () => {
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'divi');
      userEvent.type(emailLabel, 'divi@test.com');
      userEvent.type(passwordLabel, '123456');

      userEvent.click(buttonElement);
      await waitFor(() => expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams'));
    })
  })

  describe('Error', () => {
    it('should display error alert and border', async () => {
      server.use(signUpMockError);
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameElement = screen.getByLabelText('Username');
      const emailElement = screen.getByLabelText('Email');
      const passwordElement = screen.getByLabelText('Password');

      userEvent.type(usernameElement, 'divi');
      userEvent.type(emailElement, 'divi@test.com');
      userEvent.type(passwordElement, '123456');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      console.log(prettyDOM(alert))
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toEqual('Invalid credentials');
      // await waitFor(() => expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams'));

      await waitFor(() => expect(usernameElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      await waitFor(() => expect(emailElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      await waitFor(() => expect(passwordElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
    })
  })
});
