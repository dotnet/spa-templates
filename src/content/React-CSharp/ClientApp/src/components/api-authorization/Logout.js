import React from 'react';
import { useState, useEffect } from 'react';
import authService from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import { QueryParameterNames, LogoutActions, ApplicationPaths } from './ApiAuthorizationConstants';

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export function Logout(props) {
  const [message, setMessage] = useState(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const processLogoutCallback = async () => {
      const url = window.location.href;
      const result = await authService.completeSignOut(url);
      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          // There should not be any redirects as the only time completeAuthentication finishes
          // is when we are doing a redirect sign in flow.
          throw new Error('Should not redirect.');
        case AuthenticationResultStatus.Success:
          await navigateToReturnUrl(getReturnUrl(result.state));
          break;
        case AuthenticationResultStatus.Fail:
          setMessage(result.message);
          break;
        default:
          throw new Error("Invalid authentication result status.");
      }
    };
    
    const logout = async (returnUrl) => {
      const state = { returnUrl };
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const result = await authService.signOut(state);
        switch (result.status) {
          case AuthenticationResultStatus.Redirect:
            break;
          case AuthenticationResultStatus.Success:
            await navigateToReturnUrl(returnUrl);
            break;
          case AuthenticationResultStatus.Fail:
            setMessage(result.message);
            break;
          default:
            throw new Error("Invalid authentication result status.");
        }
      } else {
        setMessage("You successfully logged out!");
      }
    };
    
    const action = props.action;
    switch (action) {
      case LogoutActions.Logout:
        if (!!window.history.state.state.local) {
          logout(getReturnUrl());
        } else {
          // This prevents regular links to <app>/authentication/logout from triggering a logout
          setIsReady(true);
          setMessage("The logout was not initiated from within the page.");
        }
        break;
      case LogoutActions.LogoutCallback:
        processLogoutCallback();
        break;
      case LogoutActions.LoggedOut:
        setIsReady(true);
        setMessage("You successfully logged out!");
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }

    setIsReady(true);
  }, [])

  const getReturnUrl = (state) => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
    }
    return (state && state.returnUrl) ||
      fromQuery ||
      `${window.location.origin}${ApplicationPaths.LoggedOut}`;
  }

  const navigateToReturnUrl = (returnUrl) => window.location.replace(returnUrl);

  if (!isReady) {
    return <div/>
  }
  if (!!message) {
    return (<div>{message}</div>);
  } else {
    const action = props.action;
    switch (action) {
      case LogoutActions.Logout:
        return (<div>Processing logout</div>);
      case LogoutActions.LogoutCallback:
        return (<div>Processing logout callback</div>);
      case LogoutActions.LoggedOut:
        return (<div>{message}</div>);
      default:
        throw new Error(`Invalid action '${action}'`);
    }
  }
}