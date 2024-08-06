import styles from './CityItem.module.css'
import { CityObj } from '../model'
import { Link } from 'react-router-dom'
import { useCities } from '../contexts/CitiesContext'

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

interface Props {
  city: CityObj
}

function CityItem({ city }: Props) {
  const { currentCity, deleteCity } = useCities()
  const { cityName, emoji, date, id, position } = city

  function handleDeleteCity(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    deleteCity(Number(id))
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${id === currentCity.id && styles['cityItem--active']}`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  )
}

export default CityItem
