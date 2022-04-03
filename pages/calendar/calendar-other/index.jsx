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
import { useSelector } from 'react-redux';

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
    const wallet = useSelector((state) => state.wallet);
    const [date, setDate] = useState(new Date());
    const [showBooking, setShowBooking] = useState(true);
    const [time, setTime] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const [modal, setModal] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [listTime, setListTime] = useState([]);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [currentName, setCurrentName] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentDescription, setCurrentDescription] = useState('');

    const onTimeClick = (item) => {
        setTime(item);
    };

    useEffect(() => {
        if (router.query.transactionHashes) {
            onShowResult({
                type: 'success',
                msg: 'Your meeting request was sent',
            });
        }
    }, [router.query]);

    useEffect(() => {
        let dateArray = date.toString().split(' ');
        dateArray[4] = time?.value;
        setSelectedTime(new Date(dateArray.toString().replaceAll(',', ' ')).getTime());
    }, [time])

    const onCloseModal = () => {
        setModal(false);
        setOpenLoading(false);
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

    const generateAvailableTime = (duration) => {
        let timeList = [];
        let listObj = [];
        for (let i = 0; i < 1440; i = i + parseFloat(duration)) {
            timeList.push(i);
        }
        for (let i = 0; i < timeList.length; i++) {
            let hour = Math.floor(timeList[i] / 60);
            let min = timeList[i] % 60;
            let label_hour = hour.toString();
            let label_min = min.toString();
            if (hour < 10) label_hour = `0${hour}`;
            if (min < 10) label_min = `0${min}`;
            let label = `${label_hour}:${label_min}`;
            let value = `${label}:00`;
            let timeObj = {
                id: i,
                label: label,
                value: value
            }
            listObj.push(timeObj);
        }
        setListTime(listObj);
    }

    const onDurationChange = (duration) => {
        if (parseFloat(duration) < 5) {
            onShowResult({
                type: 'error',
                msg: 'The meeting duration can not be less than 5 minutes',
            });
        } else {
            generateAvailableTime(duration);
            setCurrentDuration(parseFloat(duration));
        }
    }

    const onRequestConnectWallet = () => {
        const { nearConfig, walletConnection } = wallet;
        walletConnection?.requestSignIn?.(nearConfig?.contractName);
    };

    const onBooking = () => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        if (userId === '') {
            onRequestConnectWallet();
        }
        let start_date = selectedTime;
        let end_date = selectedTime + currentDuration * 60 * 1000;
        setOpenLoading(true);
        contract
            ?.request_a_meeting(
                {
                    receiver: router.query.id,
                    start_date: start_date.toString(),
                    end_date: end_date.toString(),
                    name: currentName,
                    email: currentEmail,
                    description: currentDescription
                },
                300000000000000,
            )
            .then((res) => {
                setOpenLoading(false);
                if (res) {
                    onShowResult({
                        type: 'success',
                        msg: 'Your meeting request was sent',
                    });
                    setTimeout(() => {
                        router.push(`/calendar?id=${router.query.id}`);
                    }, 5000)
                } else {
                    onShowResult({
                        type: 'error',
                        msg: 'Can not send your meeting request',
                    });
                }
            })
            .catch((err) => {
                onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
        setModal(false);
    }

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
                                <input className={styles.row_booking_content_row_input} type={'number'} onChange={e => { onDurationChange(e.target.value) }} />
                                {'minutes.'}
                            </div>
                        </div>
                    )}
                    {showBooking ? (
                        <button
                            className={styles.row_booking_button_cancel}
                            onClick={() => {
                                setShowBooking(false);
                                router.push(`/calendar?id=${router.query.id}`)
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
                            listTime?.map((item) => {
                                return (
                                    <button
                                        className={time?.label === item.label ? styles.content_time_buttonA : styles.content_time_button}
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
                                <div className={styles.modal_row_label}>Name </div>
                                <input className={styles.modal_row_input} onChange={e => { setCurrentName(e.currentTarget.value); }} />
                            </div>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Email</div>
                                <input className={styles.modal_row_input} onChange={e => { setCurrentEmail(e.currentTarget.value); }} />
                            </div>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Description</div>
                                <textarea className={styles.modal_row_textarea} onChange={e => { setCurrentDescription(e.currentTarget.value); }} />
                            </div>
                            <button className={styles.confirm} onClick={() => onBooking()}>
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
    { id: 0, label: '09:00', value: '09:00:00' },
    { id: 1, label: '09:30', value: '09:30:00' },
    { id: 2, label: '10:00', value: '10:00:00' },
    { id: 3, label: '10:30', value: '10:30:00' },
    { id: 4, label: '11:00', value: '11:00:00' },
    { id: 5, label: '11:30', value: '11:30:00' },
    { id: 6, label: '12:00', value: '12:00:00' },
    { id: 7, label: '09:00', value: '09:00:00' },
    { id: 8, label: '09:30', value: '09:30:00' },
    { id: 9, label: '10:00', value: '10:00:00' },
    { id: 10, label: '10:30', value: '10:30:00' },
    { id: 11, label: '11:00', value: '11:00:00' },
    { id: 12, label: '11:30', value: '11:30:00' },
    { id: 13, label: '12:00', value: '12:00:00' },
];

export default CalendarOther;
