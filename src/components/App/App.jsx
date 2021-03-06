/* eslint-disable react/jsx-indent */
import './App.scss';

import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
// Сброс CSS для браузеров
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core';
// Тема для Material-UI
import theme from '../../theme';
import Header from 'components/Header';
import Footer from 'components/Footer';
import HomePage from 'pages/HomePage';
import BasketPage from 'pages/BasketPage';
import LoginPage from 'pages/LoginPage';
import Loading from 'components/Loading';
// машрутизация сайта
import routes from '../../routes';
import { storageAvailable } from 'helpers/localStorage';
import { serverAddress } from 'constants/ServerAddress';
import ProfilePage from 'pages/ProfilePage';
import RegisterPage from 'pages/RegisterPage';

/**
 * Класс App - корневой компонент, отображающий страницы сайта
 */
export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // ID корзины
      basketID: -1,
      // состояние создания корзины
      basketCreated: false,
      // jwt token
      jwtToken: '',
      // ошибка загрузки
      error: null,
    };
  }

  // Создаем корзину на сервере
  componentDidMount() {
    // если доступен localStorage браузера
    if (storageAvailable('localStorage')) {
      // если id корзины не существует
      if (!localStorage.getItem('basketID')) {
        // получаем с сервера id для новой корзины
        this.getBasketID();
      } else {
        // иначе загружаем id корзины из localStorage
        this.loadBasketID(localStorage.getItem('basketID'));
      }
      if (localStorage.getItem('jwtToken') !== null) {
        this.setState(prevState => {
          return {
            ...prevState,
            jwtToken: localStorage.getItem('jwtToken'),
          };
        });
      }
    } else this.getBasketID();
    // если доступен sessionStorage браузера
    if (
      this.state.jwtToken === '' &&
      storageAvailable('sessionStorage') &&
      sessionStorage.getItem('jwtToken') !== null
    ) {
      this.setState(prevState => {
        return {
          ...prevState,
          jwtToken: sessionStorage.getItem('jwtToken'),
        };
      });
    }
  }

  // получает с сервера id новой корзины и сохраняет его в state
  getBasketID = () => {
    fetch(`${serverAddress}/api/carts`, {
      method: 'post',
    })
      .then(res => res.json())
      .then(
        res => {
          this.setState(prevState => {
            if (storageAvailable('localStorage'))
              localStorage.setItem('basketID', res.result.cart.id);
            return {
              ...prevState,
              basketID: String(res.result.cart.id),
              basketCreated: true,
            };
          });
        },
        error => {
          this.setState({
            basketCreated: true,
            error,
          });
        },
      );
  };

  // проверяет наличие id корзины на сервере, в случае отсутствия получает с сервера id новой корзины и сохраняет его в state
  loadBasketID = id => {
    fetch(`${serverAddress}/api/carts/${id}`)
      .then(res => res.json())
      .then(res => {
        // если на сервере корзина с указанным id не существует
        if (res.status !== 200 || this.state.getBasketID === -1)
          // то получаем с сервера id для новой корзины
          this.getBasketID();
        // иначе сохраняем переданный id корзины в state
        else
          this.setState(prevState => {
            return {
              ...prevState,
              basketID: id,
              basketCreated: true,
            };
          });
      });
  };

  // сохраняет jwt токен в браузере и в state
  setToken = (token, saveToken) => {
    this.setState(prevState => {
      if (saveToken && storageAvailable('localStorage'))
        localStorage.setItem('jwtToken', token);
      else if (storageAvailable('sessionStorage'))
        sessionStorage.setItem('jwtToken', token);
      return {
        ...prevState,
        jwtToken: token,
      };
    });
  };

  // удаляет jwt токен из браузера и из state
  handleLogout = () => {
    this.setState(prevState => {
      if (storageAvailable('localStorage')) localStorage.removeItem('jwtToken');
      if (storageAvailable('sessionStorage'))
        sessionStorage.removeItem('jwtToken');
      return {
        ...prevState,
        jwtToken: '',
      };
    });
  };

  render() {
    const { error, basketCreated, basketID, jwtToken } = this.state;
    if (error) {
      return <p>Ошибка: {error.message}</p>;
    } else if (!basketCreated) {
      return <Loading />;
    } else {
      return (
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <div>
              <Header className='header' jwtToken={jwtToken} />
              <Switch className='page'>
                <Route
                  exact
                  path='/'
                  render={props => <HomePage {...props} basketID={basketID} />}
                />
                {routes.map((route, idx) => (
                  <Route key={idx} basketID={basketID} {...route} />
                ))}
                <Route
                  exact
                  path='/profile'
                  render={props =>
                    jwtToken !== '' ? (
                      <ProfilePage
                        {...props}
                        basketID={basketID}
                        handleLogout={this.handleLogout}
                        jwtToken={jwtToken}
                      />
                    ) : (
                      <Redirect to='/login' />
                    )
                  }
                />
                <Route
                  exact
                  path='/basket'
                  render={props => (
                    <BasketPage
                      {...props}
                      basketID={basketID}
                      setToken={this.setToken}
                      jwtToken={jwtToken}
                    />
                  )}
                />
                <Route
                  exact
                  path='/login'
                  render={props =>
                    jwtToken === '' ? (
                      <LoginPage
                        {...props}
                        basketID={basketID}
                        setToken={this.setToken}
                        jwtToken={jwtToken}
                      />
                    ) : (
                      <Redirect to='/profile' />
                    )
                  }
                />
                <Route
                  exact
                  path='/register'
                  render={props =>
                    jwtToken === '' ? (
                      <RegisterPage
                        {...props}
                        basketID={basketID}
                        setToken={this.setToken}
                        jwtToken={jwtToken}
                      />
                    ) : (
                      <Redirect to='/profile' />
                    )
                  }
                />
              </Switch>
              <Footer />
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      );
    }
  }
}
