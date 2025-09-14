import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange(start, end);
  };

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={handleDateChange}
      isClearable
      placeholderText="Select a date range"
    />
  );
};

export default DateRangePicker;
