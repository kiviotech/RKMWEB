import React from 'react';

const ApplicationFormHeader = () => {
  return (
    <div style={{
      width: '100%',
      backgroundColor: '#f97316',
      padding: '.1rem'
    }}>
      <div style={{
        maxWidth: '93.5%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <img 
            src="https://kamarpukur.rkmm.org/Logo%201-2.png" 
            alt="School Logo" 
            style={{
              height: '3rem',
              width: '3rem'
            }}
          />
        </div>
        
        <h1 style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          flexGrow: 1,
          textAlign: 'center'
        }}>
          Ramakrishna Math, Kamarpukur
        </h1>
        
        <div style={{ width: '3rem' }}></div>
      </div>
    </div>
  );
};

export default ApplicationFormHeader;
