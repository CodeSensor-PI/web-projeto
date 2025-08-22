import React from 'react'
import './divisao.css'


const Divisao = (props) => {
    const className = `divisao${props.cor ? ' ' + props.cor : ''}`;
    return (
        <div className={className} onClick={() => window.location.href = `#${props.componenteSeguinte}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
        </div>
    )
}

export default Divisao