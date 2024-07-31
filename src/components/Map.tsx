import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'

function Map() {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const lat = searchParams.get('lat')
  const lgn = searchParams.get('lng')

  return (
    <div className={styles.mapContainer} onClick={() => navigate('form')}>
      <h1>Map</h1>
      <h1>
        {lat}, {lgn}
      </h1>
    </div>
  )
}

export default Map
