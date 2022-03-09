import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';

export function LoginMenu() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const populateState = async () => {
      const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
      setIsAuthenticated(isAuthenticated);
      setUserName(user && user.name);
    };

    const subscription = authService.subscribe(() => populateState());
    populateState();
    return () => authService.unsubscribe(subscription);
  }, [])

  const authenticatedView = (userName, profilePath, logoutPath) => (
    <Fragment>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={profilePath}>Hello {userName}</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={logoutPath}>Logout</NavLink>
      </NavItem>
    </Fragment>);

  const anonymousView = (registerPath, loginPath) => (
    <Fragment>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={registerPath}>Register</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
      </NavItem>
    </Fragment>);

  if (!isAuthenticated) {
    const registerPath = `${ApplicationPaths.Register}`;
    const loginPath = `${ApplicationPaths.Login}`;
    return anonymousView(registerPath, loginPath);
  } else {
    const profilePath = `${ApplicationPaths.Profile}`;
    const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
    return authenticatedView(userName, profilePath, logoutPath);
  }
}