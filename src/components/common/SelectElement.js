import React from 'react';
import { FormattedMessage } from 'react-intl';

const SelectElement = ({
  formType,
  className,
  label,
  options,
  changeHandler,
  value,
  classname,
  translation,
}) => {
  return (
    <div className={`form-group ${classname}`}>
      {label &&
        (translation === true ? (
          <label>
            <FormattedMessage id={label} defaultMessage={label} />
            {formType === 'editForm' && <sup>*</sup>}
          </label>
        ) : (
          <label>
            {label} {formType === 'editForm' && <sup>*</sup>}
          </label>
        ))}
      <div className="select-option">
        <select
          className={className}
          onChange={changeHandler}
          value={value ? value : undefined}
          // value="81881"
        >
          {options.map((option, i) => (
            <option
              value={
                option.id
                  ? option.id
                  : option.name
                  ? option.name
                  : option.key
                  ? option.key
                  : option
              }
              key={`${
                option.name
                  ? option.name
                  : option.value
                  ? option.value
                  : option.identifier
                  ? option.identifier
                  : option
              }${i}`}
            >
              {option.name
                ? option.name
                : option.value
                ? option.value
                : option.identifier
                ? option.identifier
                : option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectElement;
