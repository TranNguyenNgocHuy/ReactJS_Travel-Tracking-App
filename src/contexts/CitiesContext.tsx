import React, { useContext, useEffect, useState, createContext } from 'react'
import { CityObj } from '../model'

interface Props {
  children: React.ReactElement
}

interface CitiesContextProps {
  cities: CityObj[]
  isLoading: boolean
  currentCity: Partial<CityObj>
  getCity: (id: string) => void
}

const BASE_URL: string = 'http://localhost:8000'

const CitiesContext = createContext<CitiesContextProps | undefined>(undefined)

function CitiesProvider({ children }: Props) {
  const [cities, setCities] = useState<CityObj[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentCity, setCurrentCity] = useState<Partial<CityObj>>({})

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true)
        const reponsive = await fetch(`${BASE_URL}/cities`)
        const data = await reponsive.json()
        setCities(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCities()
  }, [])

  async function getCity(id: string) {
    try {
      setIsLoading(true)
      const reponsive = await fetch(`${BASE_URL}/cities/${id}`)
      const data = await reponsive.json()
      setCurrentCity(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity
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
