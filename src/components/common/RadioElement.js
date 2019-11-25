import React from 'react';
import { FormattedMessage } from 'react-intl';

const RadioElement = ({
  name,
  checked,
  className,
  changeHandler,
  label,
  value,
  translation,
}) => (
  <div className={`radiobox ${className}`}>
    <label>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={changeHandler}
        value={value}
      />
      <i className="helper" />
      {translation === true ? (
        <FormattedMessage id={label} defaultMessage={label} />
      ) : (
        label
      )}
    </label>
  </div>
);

export default RadioElement;
