import React from 'react';
import './ApplicationFormFooter.scss';
import { FaFacebook, FaYoutube, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';

const ApplicationFormFooter = () => {
  return (
    <footer className="footer" style={{ backgroundColor: '#EA7704' }}>
      <div className="footer-container">
        <div className="logo-section">
          <img
            src="http://localhost:5173/src/assets/image/RMK_Logo.png"
            alt="Sri Ramakrishna Math"
            className="footer-logo"
          />
        </div>
        <div className="info-section">
          <h3 className='location' style={{ marginLeft: '24px' }}>Visit Us</h3>
          <p><MdLocationOn className="icons" />Ramakrishna Math & Ramakrishna Mission</p>
          <p className='location' style={{ marginLeft: '24px' }}>P.O. Kamarpukur, Dist.- Hooghly (WB)</p>
<p className='location' style={{ marginLeft: '24px' }}>West-Bengal - 712612, India</p>

          <p><MdEmail className="icons" /><a href="mailto:kamarpukur@rkmm.org">kamarpukur@rkmm.org</a></p>
          <p><MdPhone className="icons" /> +91-7872800844, +91-03211-244221</p>
        </div>
        <div className="timing-section">
          <h3 className='office'>Office Timings</h3>
          <p>
            <strong>April to September:</strong>
            8:30 - 11:30 a.m. & 4:00 - 6:00 p.m.
          </p>
          <p>
            <strong>October to March:</strong>
            8:30 - 11:30 a.m. & 3:30 - 5:30 p.m.
          </p>
          <h3 className='office'>Follow us</h3>
          <div className="social-media-icons" style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
  <FaFacebook className="icon_ss" style={{ fontSize: '1.5rem', color: '#fff', cursor: 'pointer' }} />
  <FaYoutube className="icon_ss" style={{ fontSize: '1.5rem', color: '#fff', cursor: 'pointer' }} />
  <FaWhatsapp className="icon_ss" style={{ fontSize: '1.5rem', color: '#fff', cursor: 'pointer' }} />
  <FaTelegram className="icon_ss" style={{ fontSize: '1.5rem', color: '#fff', cursor: 'pointer' }} />
</div>




        </div>
      </div>
    </footer>
  );
};

export default ApplicationFormFooter;