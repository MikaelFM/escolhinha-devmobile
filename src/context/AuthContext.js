/**
 * AuthContext
 * Gerenciador de autenticação e sessão da aplicação
 */
import React, { createContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';
import { setUnauthorizedHandler } from '../services/api';

export const AuthContext = createContext();

/**
 * AuthProvider
 * Envolver a aplicação com este provider
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.payload.token,
            userData: action.payload.userData,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload.token,
            userData: action.payload.userData,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            isLoading: false,
            userToken: null,
            userData: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userData: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const token = await tokenService.obterToken();
        const userData = await tokenService.obterDadosUsuario();

        if (token) {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { token, userData },
          });
        } else {
          dispatch({ type: 'SIGN_OUT' });
        }
      } catch (erro) {
        console.log('Erro ao restaurar token:', erro);
        dispatch({ type: 'SIGN_OUT' });
      }
    };

    setUnauthorizedHandler(() => {
      dispatch({ type: 'SIGN_OUT' });
    });

    bootstrapAsync();

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, senha) => {
        try {
          const resposta = await authService.login(email, senha);
          
          dispatch({
            type: 'SIGN_IN',
            payload: {
              token: resposta.token,
              userData: resposta.user,
            },
          });

          return {
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
          };
        } catch (erro) {
          return {
            sucesso: false,
            mensagem: erro.message || 'Erro ao fazer login',
          };
        }
      },

      signUp: async (email, nome, senha, confirmSenha) => {
        try {
          if (senha !== confirmSenha) {
            return {
              sucesso: false,
              mensagem: 'As senhas não coincidem',
            };
          }

          const resposta = await authService.register({
            email,
            nome,
            senha,
          });

          if (resposta.token) {
            dispatch({
              type: 'SIGN_IN',
              payload: {
                token: resposta.token,
                userData: resposta.user,
              },
            });
          }

          return {
            sucesso: true,
            mensagem: 'Registro realizado com sucesso!',
          };
        } catch (erro) {
          return {
            sucesso: false,
            mensagem: erro.message || 'Erro ao registrar',
          };
        }
      },

      signOut: async () => {
        try {
          await authService.logout();
          dispatch({ type: 'SIGN_OUT' });
          
          return {
            sucesso: true,
            mensagem: 'Logout realizado',
          };
        } catch (erro) {
          return {
            sucesso: false,
            mensagem: erro.message || 'Erro ao fazer logout',
          };
        }
      },

      verificarSessao: async () => {
        try {
          const userData = await authService.verificarSessao();
          
          dispatch({
            type: 'SIGN_IN',
            payload: {
              token: state.userToken,
              userData,
            },
          });

          return userData;
        } catch (erro) {
          dispatch({ type: 'SIGN_OUT' });
          return null;
        }
      },

      obterDadosUsuario: async () => {
        return await tokenService.obterDadosUsuario();
      },
    }),
    [state.userToken]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        ...authContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar o AuthContext
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
};
