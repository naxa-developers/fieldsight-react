import React from "react";

const SelectElement = ({
  formType,
  className,
  label,
  options,
  changeHandler,
  value,
  classname
}) => {
  // debugger;
  return (
    <div className={`form-group ${classname}`}>
      {label && (
        <label>
          {label} {formType === "editForm" && <sup>*</sup>}
        </label>
      )}
      <div className="select-option">
        <select
          className={className}
          onChange={changeHandler}
          value={value ? value : undefined}
          // value="81881"
        >
          {console.log(options, "option")}

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
