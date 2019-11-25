import React from 'react';
import { FormattedMessage } from 'react-intl';

const InputElement = ({
  tag: Tag,
  name,
  formType,
  type,
  required,
  label,
  htmlFor,
  value,
  changeHandler,
  removeBtn,
  removeHandler,
  classname,
  translation,
  ...rest
}) => (
  <div className={`form-group ${classname}`}>
    {formType === 'editForm' &&
      (translation == true ? (
        <label htmlFor={htmlFor}>
          <FormattedMessage id={label} defaultMessage={label} />
          {required && <sup>*</sup>}
        </label>
      ) : (
        <label htmlFor={htmlFor}>
          {label} {required && <sup>*</sup>}
        </label>
      ))}

    <Tag
      type={type}
      className="form-control"
      required={required}
      value={value ? value : ''}
      onChange={changeHandler}
      name={name}
      {...rest}
    />

    {formType === 'floatingForm' &&
      (translation == true ? (
        <label htmlFor={htmlFor}>
          <FormattedMessage id={label} defaultMessage={label} />
        </label>
      ) : (
        <label htmlFor={htmlFor}>{label}</label>
      ))}

    {removeBtn && (
      <span className="cross-icon" onClick={removeHandler}>
        <i className="la la-close" />
      </span>
    )}
  </div>
);

export default InputElement;
