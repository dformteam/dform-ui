import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './CalendarOther.module.scss';
import isWeekend from 'date-fns/isWeekend';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';

const CalendarOther = (props) => {
    const router = useRouter();
    const [date, setDate] = useState(new Date());

    return (
        <div className={styles.root}>
            <button className={styles.button_book}>Book a meeting</button>
            <div className={styles.content}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDatePicker
                        orientation="landscape"
                        openTo="day"
                        value={date}
                        shouldDisableDate={isWeekend}
                        onChange={(newValue) => {
                            setDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </div>
        </div>
    );
};

export default CalendarOther;
