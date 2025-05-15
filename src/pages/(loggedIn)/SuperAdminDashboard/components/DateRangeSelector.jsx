import React, { useState } from 'react';
import './DateRangeSelector.scss';

const DateRangeSelector = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Set default date range (last 30 days)
  React.useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setEndDate(formatDate(end));
    setStartDate(formatDate(start));
    
    // Don't call onDateRangeChange here to avoid infinite loop
    // The parent component should set the initial date range
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleApply = () => {
    onDateRangeChange({ startDate, endDate });
    setIsOpen(false);
  };

  const getPresetDates = (preset) => {
    const end = new Date();
    const start = new Date();
    
    switch(preset) {
      case 'today':
        // Start and end are the same day
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'last7days':
        start.setDate(start.getDate() - 6);
        break;
      case 'last30days':
        start.setDate(start.getDate() - 29);
        break;
      case 'thisMonth':
        start.setDate(1);
        break;
      case 'lastMonth':
        const lastMonth = new Date();
        lastMonth.setDate(1);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        start = new Date(lastMonth);
        end = new Date(lastMonth);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        break;
      default:
        start.setDate(start.getDate() - 29);
    }
    
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
    
    onDateRangeChange({
      startDate: formatDate(start),
      endDate: formatDate(end)
    });
    
    setIsOpen(false);
  };

  return (
    <div className="date-range-selector">
      <div className="date-range-display" onClick={() => setIsOpen(!isOpen)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="#666666" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.6667 1.33333V4" stroke="#666666" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33333 1.33333V4" stroke="#666666" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 6.66667H14" stroke="#666666" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>{startDate} - {endDate}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {isOpen && (
        <div className="date-range-popup">
          <div className="date-range-presets">
            <button onClick={() => getPresetDates('today')}>Today</button>
            <button onClick={() => getPresetDates('yesterday')}>Yesterday</button>
            <button onClick={() => getPresetDates('last7days')}>Last 7 days</button>
            <button onClick={() => getPresetDates('last30days')}>Last 30 days</button>
            <button onClick={() => getPresetDates('thisMonth')}>This month</button>
            <button onClick={() => getPresetDates('lastMonth')}>Last month</button>
          </div>
          
          <div className="date-range-custom">
            <div className="date-input-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={handleStartDateChange}
                max={endDate}
              />
            </div>
            <div className="date-input-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={handleEndDateChange}
                min={startDate}
              />
            </div>
          </div>
          
          <div className="date-range-actions">
            <button className="cancel-btn" onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="apply-btn" onClick={handleApply}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
