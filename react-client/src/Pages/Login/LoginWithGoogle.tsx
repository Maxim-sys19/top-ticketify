import React, {useCallback, useEffect} from 'react';
import {useOauthGoogleLoginMutation} from "../../redux/api/auth/oauth.service";

const LoginWithGoogle = () => {
  const [oauthGoogleLogin] = useOauthGoogleLoginMutation()
  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      const id_token = response.credential
      await oauthGoogleLogin(id_token)
    } catch (error) {
      console.log('sign in failed : ', error)
    }
  }, [oauthGoogleLogin])
  useEffect(() => {
    const script = document.createElement('script');
    const googleSignInButton = document.getElementById('googleSignInBtn')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (!window.google?.accounts.id) return;
      window.google?.accounts.id.initialize({
        client_id: process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      })
      if (googleSignInButton) {
        // googleSignInButton.style.width = '50%'
        googleSignInButton.style.marginLeft = '150px'
        googleSignInButton.style.marginTop = '10px'
        window.google?.accounts.id.renderButton(
          googleSignInButton,
          {
            theme: 'outline',
            size: 'large'
          }
        )
      }
      window.google.accounts.id.prompt()
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script);
      if (googleSignInButton) googleSignInButton.innerHTML = ''
    };
  }, [handleCredentialResponse])
  return <div id="googleSignInBtn">
    Sign in with Google
  </div>
}

export default LoginWithGoogle;