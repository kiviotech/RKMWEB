import React from 'react';
const headerStyle = {
    color: '#000',
    fontSize: '30px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    marginTop: '-1px'
};
const CommonHeaderTitle = ({ title }) => {
    return (
        <div className='header'>
            <h1 style={headerStyle}> {title} </h1>
        </div>
    )
}
export default CommonHeaderTitle

