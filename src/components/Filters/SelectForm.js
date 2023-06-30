import { useEffect } from 'react'
import { verifyFiltersActive } from '../../helpers/verifyFiltersActive'

export const SelectForm = ({
  options,
  title,
  identify,
  setFiltersActive,
  filtersActive
}) => {
  const handleChangeSelect = e => {
    const value =
      e.target.value === 'Not selected'
        ? 'Not selected'
        : e.target.value.toLowerCase()
    const active = verifyFiltersActive({
      ...filtersActive.filters,
      active: 'Not selected',
      [identify]: value
    })
    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        active,
        [identify]: value
      }
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0',
        justifyContent: 'space-between'
      }}
    >
      <label>{title}</label>
      <select onChange={handleChangeSelect}>
        <option>Not selected</option>
        {options.map((el, index) => (
          <option key={index}>{el}</option>
        ))}
      </select>
    </div>
  )
}
