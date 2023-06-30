import { useState } from 'react'
import { getCountries } from '../../helpers/getCountries'
import { useEffect } from 'react'
import { SelectForm } from './SelectForm'
import { getTTCDate } from '../../helpers/getTTCDate'
import { getCountriesTeach } from '../../helpers/getCountriesTeach'

export const ModalFilters = ({
  data,
  setShowFilters,
  setFiltersActive,
  filtersActive,
  visible
}) => {
  const [countries, setCountries] = useState([])
  const [TTCDate, setTTCDate] = useState([])
  const [teachCountries, setTeachCountries] = useState([])

  useEffect(() => {
    const ct = getCountries(data)
    const ttc = getTTCDate(data)
    const teachC = getCountriesTeach(data)
    setCountries(ct)
    setTTCDate(ttc)
    setTeachCountries(teachC)
  }, [data])

  return (
    <div className={`modalFilter ${visible && 'visible'}`}>
      <div
        style={{
          width: '60%',
          height: '80%',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '20px',
          position: 'relative'
          //   overflowY: 'scroll'
        }}
      >
        <p
          onClick={() => setShowFilters(false)}
          style={{
            color: 'black',
            cursor: 'pointer',
            padding: '20px',
            borderRadius: '100%',
            position: 'absolute',
            right: 0,
            top: 0,
            backgroundColor: '#feae00',
            height: '40px',
            width: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            marginTop: '20px',
            fontWeight: 'bold'
          }}
        >
          X
        </p>
        <h2
          style={{
            color: 'black',
            fontSize: '40px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}
        >
          Filtros
        </h2>
        <form className='formFilters'>
          <SelectForm
            options={['Vacio', 'No Vacio']}
            title='Name'
            identify='name'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
          <SelectForm
            options={['Vacio', ...countries]}
            title='Country Origin'
            identify='country'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
          <SelectForm
            options={['Vacio', ...teachCountries]}
            title='Country Residence'
            identify='teach_country'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
          <SelectForm
            options={['Vacio', 'No Vacio']}
            title='Last Name'
            identify='lastName'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
          <SelectForm
            options={['Vacio', 'No Vacio']}
            title='Email'
            identify='email'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
          <SelectForm
            options={['Autenticados', 'No Autenticados']}
            title='Estado'
            identify='state'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
          <SelectForm
            options={['Vacio', 'No Vacio', ...TTCDate]}
            title='TTC Date'
            identify='TTCDate'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
          <SelectForm
            options={['Vacio', 'No Vacio']}
            title='Phone'
            identify='phone'
            setFiltersActive={setFiltersActive}
            filtersActive={filtersActive}
          />
        </form>
      </div>
    </div>
  )
}
