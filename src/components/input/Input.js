import React from 'react'
import PropTypes from 'prop-types'
import '@components/input/Input.scss';

const Input = ({ id, name, type, value, className, labelText, placeHolder, handleChange, style }) => {
  return (
    <>
      <div className='form-row'>
        { labelText && (
          <label htmlFor={name} className='form-label'>
            {labelText}
          </label>
        )}
        <input
          name={name}
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeHolder}
          className={`form-input ${className}`}
          style={style}
          autoComplete='false'
        />
      </div>
    </>

  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  placeHolder: PropTypes.string,
  handleChange: PropTypes.func,
  style: PropTypes.object
}

export default Input
