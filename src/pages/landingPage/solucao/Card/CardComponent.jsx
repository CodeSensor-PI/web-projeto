import React from 'react'

import './card.css'

const CardComponent = ({ icons, text }) => {

    return (
        <div className='card-content'>
            <img src={icons} className="card-icon w-8 h-8" alt="" />
            <h5>{text}</h5>
        </div>
    )
}

export default CardComponent