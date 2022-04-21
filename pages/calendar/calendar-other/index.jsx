import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import getConfig from '../../../backed/config'

const nearConfig = getConfig('testnet');

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
    const [listBusyTime, setListBusyTime] = useState([]);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [currentName, setCurrentName] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentDescription, setCurrentDescription] = useState('');
    const [routerId, setRouterId] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);

    const onTimeClick = (item) => {
        setTime(item);
    };

    useEffect(() => {
        setRouterId(router.query.id);
    }, [router]);

    useEffect(async () => {
        const { contract, walletConnection } = wallet;
        let userId = walletConnection.getAccountId();
        if (router.query.transactionHashes) {
            let objectWithData = {
                "jsonrpc": "2.0",
                "id": "dontcare",
                "method": "tx",
                "params": [router.query.transactionHashes, userId]
              }
            const res = await fetch(nearConfig.nodeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objectWithData),
            })

            const data = await res.json();

            if (data?.result?.status?.SuccessValue) {
                onShowResult({
                    type: 'success',
                    msg: 'Your meeting request was sent',
                });
            } else {
                onShowResult({
                    type: 'error',
                    msg: 'Something went wrong, please try again',
                });
            }
            
        }
    }, [router.query]);

    useEffect(() => {
        let dateArray = date.toString().split(' ');
        dateArray[4] = time?.value;
        setSelectedTime(new Date(dateArray.toString().replaceAll(',', ' ')).getTime());
    }, [time]);

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

    useLayoutEffect(() => {
        onGetMaxRows();
    }, [routerId]);

    useLayoutEffect(() => {
        onGetPendingRequestRows();
    }, [routerId]);

    const onGetPendingRequestRows = () => {
        const { contract } = wallet;
        let userId = routerId;
        contract
            ?.get_pending_requests_count?.({
                userId: userId,
            })
            .then((total) => {
                onGetPendingRequests({ total });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetPendingRequests = async ({ total }) => {
        const { contract } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        let userId = routerId;
        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_pending_requests({
                        userId,
                        page: index + 1,
                    })
                    .then((data) => {
                        if (data) {
                            data.data.map((requets) => {
                                if (parseFloat(requets.end_date) - parseFloat(requets.start_date) <= 86400000) {
                                    let time_info = {
                                        start: parseFloat(requets.start_date),
                                        end: parseFloat(requets.end_date),
                                    };
                                    if (!listBusyTime.includes(time_info)) {
                                        setListBusyTime((listBusyTime) => [...listBusyTime, time_info]);
                                    }
                                }
                            });
                        }
                    });
            }),
        )
    };


    const onGetMaxRows = () => {
        const { contract } = wallet;
        let userId = routerId;
        contract
            ?.get_event_count?.({
                userId: userId,
            })
            .then((total) => {
                onGetRows({ total });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetRows = async ({ total }) => {
        const { contract } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        let userId = routerId;
        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_events({
                        userId,
                        page: index + 1,
                    })
                    .then((data) => {
                        if (data) {
                            data.data.map((event) => {
                                if (event?.is_published) {
                                    if (parseFloat(event.end_date) - parseFloat(event.start_date) <= 86400000) {
                                        let time_info = {
                                            start: parseFloat(event.start_date),
                                            end: parseFloat(event.end_date),
                                        };
                                        if (!listBusyTime.includes(time_info)) {
                                            setListBusyTime((listBusyTime) => [...listBusyTime, time_info]);
                                        }
                                    }
                                }
                            });
                        }
                    });
            }),
        ).then(() => {
            generateAvailableTime();
        });
    };

    const getTimestampFromTime = (time, cdate = date) => {
        let dateArray = cdate.toString().split(' ');
        dateArray[4] = time?.value;
        return new Date(dateArray.toString().replaceAll(',', ' ')).getTime();
    };

    const checkBusyTime = (start_time, duration) => {
        let output = false;
        let end_time = start_time + duration * 60 * 1000;
        for (let i = 0; i < listBusyTime.length; i++) {
            let isStart = start_time >= listBusyTime[i].start && start_time <= listBusyTime[i].end;
            let isEnd = end_time >= listBusyTime[i].start && end_time <= listBusyTime[i].end;
            if (isStart || isEnd) {
                output = true;
                break;
            }
        }
        return output;
    };

    const generateAvailableTime = (duration = currentDuration, cdate = date) => {
        // console.log(listBusyTime);
        if (duration > 0) {
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
                    value: value,
                };

                if (checkBusyTime(getTimestampFromTime(timeObj, cdate), duration)) {
                    timeObj.label = 'Busy';
                }
                listObj.push(timeObj);
            }
            setListTime(listObj);
        }
    };

    const onDurationChange = (duration) => {
        if (duration) {
            generateAvailableTime(duration);
        } else {
            setListTime([]);
        }
        setCurrentDuration(parseFloat(duration));
    };

    const onRequestConnectWallet = () => {
        const { nearConfig, walletConnection } = wallet;
        walletConnection?.requestSignIn?.(nearConfig?.contractName);
    };

    const onBooking = async () => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        if (userId === '') {
            onRequestConnectWallet();
        }
        let start_date = selectedTime;
        let end_date = selectedTime + currentDuration * 60 * 1000;
        setOpenLoading(true);
        const meeting_fee = await contract?.get_meeting_fee({
            userId: userId,
        });

        if (meeting_fee === '0' || meeting_fee === null) {
            contract
                ?.request_a_meeting(
                    {
                        receiver: router.query.id,
                        start_date: start_date.toString(),
                        end_date: end_date.toString(),
                        name: currentName,
                        email: currentEmail,
                        description: currentDescription,
                    },
                    50000000000000,
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
                        }, 5000);
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
        } else if (meeting_fee !== '0') {
            contract
                ?.request_a_meeting(
                    {
                        receiver: router.query.id,
                        start_date: start_date.toString(),
                        end_date: end_date.toString(),
                        name: currentName,
                        email: currentEmail,
                        description: currentDescription,
                    },
                    50000000000000,
                    meeting_fee,
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
                        }, 5000);
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
        }

        setModal(false);
    };

    const onConfirm = () => {
        if (currentDuration < 5) {
            onShowResult({
                type: 'error',
                msg: 'The meeting duration can not be less than 5 minutes',
            });
        } else {
            setModal(true);
        }
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
                                <input
                                    className={styles.row_booking_content_row_input}
                                    type={'number'}
                                    onChange={(e) => {
                                        onDurationChange(e.target.value);
                                    }}
                                />
                                {'minutes.'}
                            </div>
                        </div>
                    )}
                    {showBooking ? (
                        <button
                            className={styles.row_booking_button_cancel}
                            onClick={() => {
                                setShowBooking(false);
                                router.push(`/calendar?id=${router.query.id}`);
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
                                disablePast
                                orientation="landscape"
                                openTo="day"
                                value={date}
                                shouldDisableDate={isWeekend}
                                onChange={(newValue) => {
                                    generateAvailableTime(currentDuration, newValue);
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
                                        disabled={item.label === 'Busy' ? true : false}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                    </div>
                </div>
                {showBooking && (
                    <button className={styles.confirm} onClick={() => onConfirm()}>
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
                                <input
                                    className={styles.modal_row_input}
                                    onChange={(e) => {
                                        setCurrentName(e.currentTarget.value);
                                    }}
                                />
                            </div>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Email</div>
                                <input
                                    className={styles.modal_row_input}
                                    onChange={(e) => {
                                        setCurrentEmail(e.currentTarget.value);
                                    }}
                                />
                            </div>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Description</div>
                                <textarea
                                    className={styles.modal_row_textarea}
                                    onChange={(e) => {
                                        setCurrentDescription(e.currentTarget.value);
                                    }}
                                />
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
