import React, { useContext, useEffect, createContext, useReducer } from 'react'
import { CityObj } from '../model'

const BASE_URL: string = 'http://localhost:8000'

interface Props {
  children: React.ReactElement
}

interface CitiesContextProps {
  cities: CityObj[]
  isLoading: boolean
  currentCity: Partial<CityObj>
  error: string
  getCity: (id: string) => void
  createCity: (newCity: CityObj) => void
  deleteCity: (id: number) => void
}

const CitiesContext = createContext<CitiesContextProps | undefined>(undefined)

type Action =
  | { type: 'loading' }
  | { type: 'cities/loaded'; payload: CityObj[] }
  | { type: 'city/loaded'; payload: CityObj }
  | { type: 'city/created'; payload: CityObj }
  | { type: 'city/deleted'; payload: number }
  | { type: 'rejected'; payload: string }

interface State {
  cities: CityObj[]
  isLoading: boolean
  currentCity: Partial<CityObj>
  error: string
}

const initialState: State = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: ''
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true
      }
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload
      }
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      }
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {}
      }
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      throw new Error('Unknown action type')
  }
}

function CitiesProvider({ children }: Props) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: 'loading' })
      try {
        const reponsive = await fetch(`${BASE_URL}/cities`)
        const data = await reponsive.json()
        dispatch({ type: 'cities/loaded', payload: data })
      } catch (err) {
        dispatch({ type: 'rejected', payload: 'There was an error loading cities...' })
      }
    }
    fetchCities()
  }, [])

  async function getCity(id: string) {
    if (Number(id) === currentCity.id) return

    dispatch({ type: 'loading' })
    try {
      const reponsive = await fetch(`${BASE_URL}/cities/${id}`)
      const data = await reponsive.json()
      dispatch({ type: 'city/loaded', payload: data })
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'There was an error loading city...' })
    }
  }

  async function createCity(newCity: CityObj) {
    dispatch({ type: 'loading' })
    try {
      const reponsive = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await reponsive.json()
      dispatch({ type: 'city/created', payload: data })
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'There was an error creating city.' })
    }
  }

  async function deleteCity(id: number) {
    dispatch({ type: 'loading' })
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE'
      })
      dispatch({ type: 'city/deleted', payload: id })
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'There was an error deleting city.' })
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext)
  if (context === undefined) throw new Error('CitiesContext was used outside the CitiesProvider')
  return context
}

export { CitiesProvider, useCities }
