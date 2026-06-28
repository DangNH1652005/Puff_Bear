import React from 'react'
import "../../styles/customer/ProfileCustomerPage.css"

const InfoItem = ({ icon, title, value }) => {
 return (
    <div className="info-item">
      <div className="info-icon">{icon}</div>

      <div>
        <small>{title}</small>

        <h6>{value}</h6>
      </div>
    </div>
  );
}

export default InfoItem