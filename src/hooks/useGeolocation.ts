import { useState } from 'react'

interface Position {
  lat: number
  lng: number
}

interface Props {
  defaultPosition?: Position | null
}

export function useGeolocation({ defaultPosition = null }: Props = {}) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [position, setPosition] = useState<Position | null>(defaultPosition)

  function getPosition() {
    if (!navigator.geolocation) return setError('Your browser does not support geolocation')

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
        setIsLoading(false)
      },
      (error) => {
        setError(error.message)
        setIsLoading(false)
      }
    )
  }

  return { position, isLoading, error, getPosition }
}
