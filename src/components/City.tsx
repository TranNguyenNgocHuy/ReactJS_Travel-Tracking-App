import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useCities } from '../contexts/CitiesContext'
import styles from './City.module.css'
import Spinner from './Spinner'
import BackButton from './BackButton'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))

const flagemojiToPNG = (flag: string) => {
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt(0) ?? 0)
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join('')
  return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />
}

function City() {
  const { id } = useParams()
  const { getCity, currentCity, isLoading } = useCities()

  useEffect(() => {
    if (id) {
      getCity(id)
    }
  }, [id])

  const { cityName, emoji, date, notes } = currentCity

  if (isLoading) return <Spinner />

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji && flagemojiToPNG(emoji)}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{date && formatDate(date)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a href={`https://en.wikipedia.org/wiki/${cityName}`} target='_blank' rel='noreferrer'>
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  )
}

export default City
