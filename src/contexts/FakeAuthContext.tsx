import { useContext, useReducer, createContext } from 'react'
import { User } from '../model'

interface Props {
  children: React.ReactElement
}

interface AuthContextProps {
  user: User | null
  isAuthentication: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface State {
  user: User | null
  isAuthentication: boolean
}

type Action = { type: 'login'; payload: User } | { type: 'logout' }

const initialState: State = {
  user: null,
  isAuthentication: false
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        isAuthentication: true,
        user: action.payload
      }
    case 'logout':
      return {
        ...state,
        isAuthentication: false,
        user: null
      }
    default:
      throw new Error('Unknown action type')
  }
}

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz'
}

function AuthProvider({ children }: Props) {
  const [{ user, isAuthentication }, dispatch] = useReducer(reducer, initialState)

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER })
    }
  }

  function logout() {
    dispatch({ type: 'logout' })
  }

  return <AuthContext.Provider value={{ user, isAuthentication, login, logout }}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('AuthContext was used outside AuthProvider')
}

export { AuthProvider, useAuth }
