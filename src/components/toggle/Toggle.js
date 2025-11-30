import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '@components/toggle/Toggle.scss';

const Toggle = ({ toggle, onClick }) => {
  const [toggleValue, setToggleValue] = useState(toggle);

  return (
    <label className="switch" htmlFor="switch" data-testid="toggle" onClick={onClick}>
      <input
        id="switch"
        type="checkbox"
        checked={toggleValue}
        onChange={() => setToggleValue((toggleValue) => !toggleValue)}
      />
      <span className="slider round"></span>
    </label>
  )
}

Toggle.propTypes = {
  toggleValue: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Toggle;
