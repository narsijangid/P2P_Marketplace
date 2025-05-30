import React from 'react';

export default function Search(props) {
    return (
        <img 
            src="https://cdn-icons-png.flaticon.com/512/15924/15924413.png" 
            alt="Search Icon" 
            width="36px" 
            height="36px" 
            style={{ color: props.color ? props.color : '' }}
        />
    );
}
