import { createContext, useEffect, useReducer } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import firebase from 'src/utils/firebase';

const initialAuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: 'FirebaseAuth',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  };

  const createUserWithEmailAndPassword = async (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              jobtitle: 'Lead Developer',
              avatar: user.photoURL,
              email: user.email,
              name: user.displayName || user.email,
              role: 'admin',
              location: 'San Francisco, USA',
              username: 'admin',
              posts: '4',
              coverImg: 'http://lorempixel.com/640/480/cats',
              followers: '5684',
              description:
                'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
            }
          }
        });
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (!state.isInitialised) {
    return <SuspenseLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'FirebaseAuth',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
