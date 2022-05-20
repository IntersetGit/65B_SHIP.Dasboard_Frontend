import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
} from '../../../../shared/constants/ActionTypes';
import jwtAxios, { setAuthToken } from './jwt-api';
import Api from '../../../../util/Api/Api';

const JWTAuthContext = createContext();
const JWTAuthActionsContext = createContext();

export const useJWTAuth = () => useContext(JWTAuthContext);

export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

const JWTAuthAuthProvider = ({ children }) => {
  const [firebaseData, setJWTAuthData] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const getAuthUser = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('nologin');
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      setAuthToken(token);
      Api.get('/auth/mydata').then((res) =>
        setJWTAuthData({
          user: res.data.Message,
          isLoading: false,
          isAuthenticated: true,
        }),
      ).catch(() =>
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        }),
      );
    };

    getAuthUser();
  }, []);

  const signInUser = async ({ email, password }) => {
    dispatch({ type: FETCH_START });
    try {

      /* new */
      const { data } = await Api.post(`/auth/login`, {
        username: email,
        password
      });
      if (data.Status === "success") {

        const { access_token } = data.Message;
        localStorage.setItem('token', access_token);
        setAuthToken(access_token);

        /* mydata */
        const res = await Api.get('/auth/mydata');
        console.log('res.data', res.data)
        if (res.data.Status == "success") {
          setJWTAuthData({ user: res.data.Message, isAuthenticated: true, isLoading: false });
          dispatch({ type: FETCH_SUCCESS });
        } else {
          setJWTAuthData({
            ...firebaseData,
            isAuthenticated: false,
            isLoading: false,
          });
          dispatch({ type: FETCH_ERROR, payload: res.data.Message });
        }

      } else {
        setJWTAuthData({
          ...firebaseData,
          isAuthenticated: false,
          isLoading: false,
        });
        dispatch({ type: FETCH_ERROR, payload: data.Message });
      }

      /* old */
      // const { data } = await jwtAxios.post('auth', { email, password });
      // localStorage.setItem('token', data.token);
      // setAuthToken(data.token);
      // const res = await jwtAxios.get('/auth');
      // setJWTAuthData({ user: res.data, isAuthenticated: true, isLoading: false });
      // dispatch({ type: FETCH_SUCCESS });
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      dispatch({ type: FETCH_ERROR, payload: error.message });
    }
  };

  const signUpUser = async ({ name, email, password }) => {
    dispatch({ type: FETCH_START });
    try {
      const { data } = await jwtAxios.post('users', { name, email, password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      const res = await jwtAxios.get('/auth');
      setJWTAuthData({ user: res.data, isAuthenticated: true, isLoading: false });
      dispatch({ type: FETCH_SUCCESS });
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      dispatch({ type: FETCH_ERROR, payload: error.message });
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setAuthToken();
    setJWTAuthData({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <JWTAuthContext.Provider
      value={{
        ...firebaseData,
      }}
    >
      <JWTAuthActionsContext.Provider
        value={{
          signUpUser,
          signInUser,
          logout,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};
export default JWTAuthAuthProvider;

JWTAuthAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
