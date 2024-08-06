import React from 'react';
import icons from '../../constants/icons'; // Adjust the import based on where your icons are located

const SearchBar = () => {
    const styles = {
        search: {
            position: 'relative'
        },
        input: {
            background: '#DEE4ED',
            width: '180px',
            height: '34px',
            borderRadius: '7px',
            border: 'none',
            paddingLeft: '30px'
        },
        img: {
            position: 'absolute',
            top: '8px',
            left: '10px'
        },
        placeholder: {
            color: '#525E6F',
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '15px'
        }
    };

    return (
        <div style={styles.search}>
            <img src={icons.search} alt="Search" style={styles.img} />
            <input 
                type="text" 
                placeholder="Search Guest" 
                style={styles.input}
            />
        </div>
    );
};

export default SearchBar;
