import React from "react";

const CountCard = ({
  countName,
  countNumber,
  icon,
  className,
  noSubmissionText
}) => {
  return (
    <div className="count-card">
      <div className={`count-icon ${className ? className : ""}`}>
        <i className={`la ${icon}`}> </i>
      </div>
      <div className="count-content">
        <h4>{countNumber !== 0 && countNumber}</h4>
        <h6>
          {noSubmissionText
            ? countNumber === 0
              ? `No ${countName}`
              : `${countName}`
            : countNumber === 0
            ? `No ${countName} submission`
            : `${countName} submission`}
          {countNumber !== 0 && countNumber > 1 && (
            <span style={{ textTransform: "lowercase" }}>(s)</span>
          )}
        </h6>
      </div>
    </div>
  );
};

export default CountCard;
