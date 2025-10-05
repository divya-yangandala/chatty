import axios from '@services/axios';


class UserService {
  async getUserSuggestions () {
    const response = await axios.get('/user/profile/user/suggestions');
    return response;
  }

  async logoutUser () {
    const response = await axios.get('/signout');
    return response;
  }

  async checkCurrentUser () {
    const response = await axios.get('/currentuser');
    return response;
  }

  async getAllUsers(page) {
    const response = await axios.get(`/user/all/${page}`);
    return response;
  }
}

// we'll add these users data from the API to redux store and from redux we'll fetch the Users suggestions

export const userService = new UserService();
