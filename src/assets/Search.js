import React from 'react';

export default function Search(props) {
    return (
        <img 
            src="https://static.vecteezy.com/system/resources/thumbnails/017/743/438/small_2x/3d-search-icon-png.png" 
            alt="Search Icon" 
            width="36px" 
            height="36px" 
            style={{ color: props.color ? props.color : '' }}
        />
    );
}
