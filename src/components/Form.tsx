// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import styles from './Form.module.css'
import Button from './Button'
import BackButton from './BackButton'
import { useUrlPosition } from '../hooks/useUrlPosition'
import Message from './Message'
import Spinner from './Spinner'
import { useCities } from '../contexts/CitiesContext'
import { CityObj } from '../model'
import { useNavigate } from 'react-router-dom'

function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0) ?? 0)
  return String.fromCodePoint(...codePoints)
}

const flagemojiToPNG = (flag: string) => {
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt(0) ?? 0)
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join('')
  return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

function Form() {
  const [lat, lng] = useUrlPosition()
  const { createCity, isLoading } = useCities()
  const navigate = useNavigate()

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState<boolean>(false)
  const [cityName, setCityName] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [date, setDate] = useState<Date | null>(new Date())
  const [notes, setNotes] = useState<string>('')
  const [emoji, setEmoji] = useState<string>('')
  const [geoCodingError, setGeoCodingError] = useState<string>('')

  useEffect(() => {
    if (!lat && !lng) return
    async function fecthCityData() {
      try {
        setIsLoadingGeocoding(true)
        setGeoCodingError('')
        const responsive = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await responsive.json()

        if (!data.countryCode) throw new Error("That doesn't seem to be a city. Click somewhere else")

        setCityName(data.city || data.locality || '')
        setCountry(data.countryName)
        setEmoji(convertToEmoji(data.countryCode))
      } catch (err) {
        console.error(err)
        setGeoCodingError((err as Error).message || 'An unexpected error occurred')
      } finally {
        setIsLoadingGeocoding(false)
      }
    }

    fecthCityData()
  }, [lat, lng])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!cityName || !date) return

    const newCity: CityObj = {
      cityName,
      country,
      emoji,
      date: date.toISOString(),
      notes,
      position: { lat: Number(lat), lng: Number(lng) }
    }
    await createCity(newCity)
    navigate('/app/cities')
  }

  if (isLoadingGeocoding) return <Spinner />

  if (!lat && !lng) return <Message message='Start by clicking somewhere on the map' />

  if (geoCodingError) return <Message message={geoCodingError} />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input id='cityName' onChange={(e) => setCityName(e.target.value)} value={cityName} />
        <span className={styles.flag}>{emoji && flagemojiToPNG(emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <DatePicker id='date' onChange={(date) => setDate(date)} selected={date} dateFormat='dd/MM/yyyy' />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea id='notes' onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  )
}

export default Form
