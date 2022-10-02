import React, {useContext, useEffect, useState} from 'react';
import { supabase } from '../supabase';

const AuthContext = React.createContext(null)

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signInWithDiscord() {
    const { error }: any = await supabase.auth.signIn({
      provider: 'discord',
    },
    {
      redirectTo: 'https://www.openguess.pl/redirect'
  });

    if (error) {
        console.error(error);
        return;
    }
  }

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      if(_event !== 'SIGNED_IN') {
        setSession(session);
      } else {
        /*
        if (!document.location.href.includes('guess') && !document.location.href.includes('score') && !document.location.href.includes('final')) {
          setSession(session);
          console.log('Signed in!');
        }
        */
        if (document.location.href.includes('redirect')) {
          setSession(session);
          console.log('Signed in!');
        }
      }
    });
    setLoading(false);
  }, []); 

  async function logout() {
      const { error } = await supabase.auth.signOut()
  }

  const value = {
    signInWithDiscord,
    logout,
    session,
  }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}