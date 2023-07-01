import { useEffect, useRef } from 'react'
import { verifyFiltersActive } from '../../helpers/verifyFiltersActive'
import { useState } from 'react'

export const SelectForm = ({
  options,
  title,
  identify,
  setFiltersActive,
  filtersActive
}) => {
  const [notSelect, setNotSelect] = useState(true)
  const refSelect = useRef()

  useEffect(
    () => setNotSelect(refSelect.current.value === 'Not selected'),
    [filtersActive]
  )

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
      <select
        onChange={handleChangeSelect}
        style={{ backgroundColor: !notSelect ? '#feae00' : 'white' }}
        ref={refSelect}
      >
        <option>Not selected</option>
        {options.map((el, index) => (
          <option
            key={index}
            selected={filtersActive.filters[identify] !== 'Not selected'}
          >
            {el}
          </option>
        ))}
      </select>
    </div>
  )
}
