import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import '@components/input/Input.scss';

// const Input = ({ id, name, type, value, className, labelText, placeHolder, handleChange, style }) => {
//   return (
//     <>
//       <div className='form-row'>
//         { labelText && (
//           <label htmlFor={name} className='form-label'>
//             {labelText}
//           </label>
//         )}
//         <input
//           name={name}
//           id={id}
//           type={type}
//           value={value}
//           onChange={handleChange}
//           placeholder={placeHolder}
//           className={`form-input ${className}`}
//           style={style}
//           autoComplete='false'
//         />
//       </div>
//     </>

//   )
// }

const Input = forwardRef((props, ref) => {
  return (
    <div className='form-row'>
    { props.labelText && (
      <label htmlFor={props.name} className='form-label'>
        {props.labelText}
      </label>
    )}
    <input
      ref={ref}
      name={props.name}
      id={props.id}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      placeholder={props.placeholder}
      className={`form-input ${props.className}`}
      style={props.style}
      autoComplete='false'
    />
  </div>
  )
})

// @ts-expect-error propTypes is deprecated in types but still works in runtime
Input.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object
}

export default Input;
