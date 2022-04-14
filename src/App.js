
import './App.css';
import Amplify, { Storage }from 'aws-amplify';
import React from 'react';
import { AmplifySignIn, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import S3page from './S3page';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import config from './config.json'

Amplify.configure({
  Storage: {
    AWSS3: {
      bucket: config.bucket,
      region: config.cognito_region
    },
    
    customPrefix: {
      private: config.BucketPrefix + "/"
    },
  },

  Auth: {
    identityPoolId: config.identityPoolId
  },
  aws_cognito_region: config.cognito_region,
  aws_user_pools_id: config.user_pools_id,
  aws_user_pools_web_client_id: config.user_pools_web_client_id,
});
Storage.configure({ level: 'private' })

const AuthStateApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <S3page/>
    </div>
  ) :
  (
    <AmplifyAuthenticator>
      <AmplifySignIn
        headerText="S3 Upload Tool"
        usernameAlias="email"
        hideSignUp="true"
        slot="sign-in"
      />
    </AmplifyAuthenticator>
  );
}

export default AuthStateApp;
