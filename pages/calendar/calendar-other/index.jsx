import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './CalendarOther.module.scss';
import isWeekend from 'date-fns/isWeekend';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Notify from '../../../components/Notify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    bgcolor: '#fff',
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    paddingTop: '20px',
};

const CalendarOther = () => {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [showBooking, setShowBooking] = useState(false);
    const [time, setTime] = useState();
    const [modal, setModal] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');

    const onTimeClick = (item) => {
        setTime(item.id);
    };

    const onCloseModal = () => {
        setModal(false);
        setOpenLoading(true);
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenSnack(true);
        setOpenLoading(false);
        setAlertType(type);
        setSnackMsg(msg);
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.row_booking}>
                    {showBooking && (
                        <div className={styles.row_booking_content}>
                            <div className={styles.row_booking_content_label}>Select Date {'&'} Time</div>
                            <div className={styles.row_booking_content_row}>
                                <div className={styles.row_booking_content_row_label}>Duration</div>
                                <input className={styles.row_booking_content_row_input} type={'number'} />
                                {'minutes.'}
                            </div>
                        </div>
                    )}
                    {showBooking ? (
                        <button
                            className={styles.row_booking_button_cancel}
                            onClick={() => {
                                setShowBooking(false);
                            }}
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            className={styles.row_booking_button_book}
                            onClick={() => {
                                setShowBooking(true);
                            }}
                        >
                            Book a meeting
                        </button>
                    )}
                </div>
                <div className={styles.content}>
                    <div className={styles.content_calendar}>
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
                    <div className={styles.content_time}>
                        {showBooking &&
                            aTimes?.map((item) => {
                                return (
                                    <button
                                        className={time === item.id ? styles.content_time_buttonA : styles.content_time_button}
                                        onClick={() => onTimeClick(item)}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                    </div>
                </div>
                {showBooking && (
                    <button className={styles.confirm} onClick={() => setModal(true)}>
                        Confirm
                    </button>
                )}
                <Modal open={modal} onClose={onCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Enter Details
                        </Typography>
                        <div className={styles.modal}>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Name</div>
                                <input className={styles.modal_row_input} />
                            </div>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Email</div>
                                <input className={styles.modal_row_input} />
                            </div>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Description</div>
                                <textarea className={styles.modal_row_textarea} />
                            </div>
                            <button className={styles.confirm} onClick={() => setModal(false)}>
                                Booking
                            </button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

const aTimes = [
    { id: 0, label: '09:00', value: '' },
    { id: 1, label: '09:30', value: '' },
    { id: 2, label: '10:00', value: '' },
    { id: 3, label: '10:30', value: '' },
    { id: 4, label: '11:00', value: '' },
    { id: 5, label: '11:30', value: '' },
    { id: 6, label: '12:00', value: '' },
    { id: 7, label: '09:00', value: '' },
    { id: 8, label: '09:30', value: '' },
    { id: 9, label: '10:00', value: '' },
    { id: 10, label: '10:30', value: '' },
    { id: 11, label: '11:00', value: '' },
    { id: 12, label: '11:30', value: '' },
    { id: 13, label: '12:00', value: '' },
];

export default CalendarOther;
