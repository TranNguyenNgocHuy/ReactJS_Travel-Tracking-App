import { CountryObj } from '../model'
import styles from './CountryItem.module.css'

const flagemojiToPNG = (flag: string) => {
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt(0) ?? 0)
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join('')
  return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />
}

interface Props {
  country: CountryObj
}

function CountryItem({ country }: Props) {
  return (
    <li className={styles.countryItem}>
      <span>{flagemojiToPNG(country.emoji)}</span>
      <span>{country.country}</span>
    </li>
  )
}

export default CountryItem
