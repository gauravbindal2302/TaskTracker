import React from "react";

const CustomAlert = ({ message, style }) => {
  return (
    <div className="modal show" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={style}>
          <div className="modal-body">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
