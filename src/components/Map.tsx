import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import styles from './Map.module.css'
import { useEffect, useState } from 'react'
import { useCities } from '../contexts/CitiesContext'
import { useGeolocation } from '../hooks/useGeolocation'
import Button from './Button'

interface Props {
  position: [number, number]
}

const flagemojiToPNG = (flag: string) => {
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt(0) ?? 0)
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join('')
  return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />
}

function Map() {
  const { cities } = useCities()
  const [mapPosition, setMapPosition] = useState<[number, number]>([40, 0])
  const [searchParams] = useSearchParams()
  const { isLoading: isLoadingPosition, position: geolocationPosition, getPosition } = useGeolocation()

  const mapLat = searchParams.get('lat')
  const mapLng = searchParams.get('lng')

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([Number(mapLat), Number(mapLng)])
  }, [mapLat, mapLng])

  useEffect(() => {
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition])

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer className={styles.map} center={mapPosition} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
            <Popup>
              <span>{flagemojiToPNG(city.emoji)}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }: Props) {
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick() {
  const navigate = useNavigate()

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  })
  return null
}

export default Map
