import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { BsCheckLg, BsChevronDown } from 'react-icons/bs'
import { verifyFiltersActive } from '../../helpers/verifyFiltersActive'

export const SelectMultipleOption = ({
  options,
  title,
  identify,
  setFiltersActive,
  filtersActive
}) => {
  const refOptions = useRef()
  const [optionsSelected, setOptionsSelected] = useState([])

  useEffect(() => {
    if (filtersActive.filters[identify] !== 'Not selected')
      setOptionsSelected([...filtersActive.filters[identify]])
  }, [])

  const selectOption = optionSelect => {
    console.log(filtersActive.filters)
    const value = optionSelect.toLowerCase()
    const option = options.find(el => el.option.toLowerCase() == value)
    const index = optionsSelected.findIndex(el => el.toLowerCase() == value)
    console.log({ optionsSelected, value })
    if (index != -1) {
      const deleted = optionsSelected.filter((el, i) => index != i)
      console.log({ deleted })
      setOptionsSelected(deleted)
    } else {
      setOptionsSelected([...optionsSelected, value])
    }
    option.select = !option.select
  }

  useEffect(() => {
    console.log(optionsSelected)
    // console.log(filtersActive.filters)
    const active = verifyFiltersActive({
      ...filtersActive.filters,
      active: 'Not selected',
      [identify]:
        optionsSelected.length === 0 ? 'Not selected' : optionsSelected
    })

    if (optionsSelected.length === 0) {
      setFiltersActive({
        ...filtersActive,
        filters: {
          ...filtersActive.filters,
          active,
          [identify]: 'Not selected'
        }
      })
    } else {
      setFiltersActive({
        ...filtersActive,
        filters: {
          ...filtersActive.filters,
          active,
          [identify]: optionsSelected
        }
      })
    }
  }, [optionsSelected])

  const handleVisibleOptions = () => {
    refOptions.current.classList.toggle('visible')
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '20px 0'
        }}
      >
        <p style={{ margin: 0 }}>{title}</p>
        <div
          onClick={handleVisibleOptions}
          style={{
            cursor: 'pointer',
            backgroundColor: optionsSelected.length > 0 ? '#feae00' : 'white',
            color: optionsSelected.length > 0 ? 'white' : 'black',
            flexBasis: '67.5%',
            padding: 8,
            fontSize: 17,
            border: '1px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <p style={{ margin: 0 }}>
            {optionsSelected.length > 0 ? 'Active' : 'Not selected'}
          </p>
          <BsChevronDown style={{ fontSize: 13, fontWeight: 'bold' }} />
        </div>
      </div>
      <div className='multiple-options' ref={refOptions}>
        <p
          onClick={handleVisibleOptions}
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
        <div className='multiple-options__options'>
          {options?.map((el, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderBottom: '2px solid black',
                backgroundColor: el.select ? '#d39e00' : 'white'
              }}
            >
              <div
                style={{
                  color: el.select ? 'white' : 'black',
                  fontWeight: 'bold',
                  fontSize: 17
                }}
              >
                {el.option}
              </div>
              {!el.select ? (
                <div
                  style={{
                    cursor: 'pointer',
                    width: 20,
                    height: 20,
                    borderRadius: 2,
                    border: '1px solid black',
                    backgroundColor: 'white'
                  }}
                  onClick={() => selectOption(el.option)}
                ></div>
              ) : (
                <BsCheckLg
                  style={{
                    cursor: 'pointer',
                    width: 20,
                    height: 20,
                    borderRadius: 2,
                    border: '1px solid black',
                    backgroundColor: 'white'
                  }}
                  onClick={() => selectOption(el.option)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
