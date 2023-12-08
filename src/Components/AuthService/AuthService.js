import API from '../Enviroment/API'
class AuthService {
    login(username, password) {
      return fetch(`${API}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          localStorage.setItem("auth", true);
          this.getUserData();
        }
        return data;
      });
    }
  
    refresh() {
      const refreshToken = localStorage.getItem('refreshToken');
      return fetch(`${API}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
        }
        return data;
      });
    }
  
    getToken() {
      return localStorage.getItem('accessToken');
    }
  
    isAuthenticated() {
      const token = this.getToken();
      return token !== null;
    }
  
    requestWithRefresh(config) {
      return fetch(config.url, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${this.getToken()}`,
        },
      })
      .then(response => {
        if (response.status === 401) {
          return this.refresh().then(refreshData => {
            if (refreshData.access) {
              return fetch(config.url, {
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${refreshData.access}`,
                },
              });
            } else {
              this.logout();          
            }
          });
        } else {
          return response;
        }
      })
      .then(response => response.json());
    }
  
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }

    getUserData() {
      this.requestWithRefresh({
        method: 'GET',
        url: `${API}/auth/get-authenticated-user/`
    })
    .then(data => {
      localStorage.setItem('userData', JSON.stringify(data));
      window.location.href = '/';
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });

    }

  }
  const authService = new AuthService();
  
  export default authService;
  
