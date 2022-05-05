import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import styles from './Calendar.module.scss';
import Kalend, { CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ModalShare from '../../components/Share';
import Notify from '../../components/Notify';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { utils } from 'near-api-js';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 800,
    bgcolor: '#fff',
    borderRadius: '8px',
    boxShadow: 24,
    outline: 'none',
    paddingTop: '20px',
};

const DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EVENT_TYPE = {
    ONLINE: 0,
    INPERSON: 1,
    ONLINE_AND_INPERSON: 2,
    MEETING_REQUEST: 3,
};

const Calendar = (props) => {
    const events = [];
    const meetings = [];
    const router = useRouter();

    const colorList = ['red', 'blue', 'orange', 'green', 'violet'];
    const [eventsList, setEventsList] = useState(events);
    const [meetingsUcmList, setMeetingsUcmList] = useState(meetings);
    const [meetingsPstList, setMeetingsPstList] = useState(meetings);
    const wallet = useSelector((state) => state.wallet);
    const [link, setLink] = useState({ link: '', name: '' });
    const [modalShare, setModalShare] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [routerId, setRouterId] = useState('');
    const [modal, setModal] = useState(false);
    const [notify, setNotify] = useState([]);
    const [modalSetting, setModalSetting] = useState(false);
    const [free, setFree] = useState(true);
    // const [fee, setFee] = useState('0');
    const [currentMeetingFee, setCurrentMeetingFee] = useState(0);
    const [tabActive, setTabActive] = useState('listview');
    const [tabInList, setTabInList] = useState(0);

    const [time, setTime] = useState([
        { id: 0, label: 'Sun', check: false, startTime: '09:00', endTime: '17:00' },
        { id: 1, label: 'Mon', check: true, startTime: '09:00', endTime: '17:00' },
        { id: 2, label: 'Tue', check: true, startTime: '09:00', endTime: '17:00' },
        { id: 3, label: 'Wed', check: true, startTime: '09:00', endTime: '17:00' },
        { id: 4, label: 'Thur', check: true, startTime: '09:00', endTime: '17:00' },
        { id: 5, label: 'Fri', check: true, startTime: '09:00', endTime: '17:00' },
        { id: 6, label: 'Sat', check: false, startTime: '09:00', endTime: '17:00' },
    ]);

    useEffect(() => {
        onGetMaxRows();
        getAvailableTime();
    }, [routerId]);

    useEffect(() => {
        getMeetingFee();
    }, []);

    useEffect(() => {
        if (router.query.account_id) {
            router.push(`/calendar?id=${router.query.id}`);
        } else {
            setRouterId(router.query.id);
        }
    }, [router]);

    // useEffect(() => {
    //     onGetPendingRequestRows();
    // }, []);

    const getAvailableTime = () => {
        const { contract, walletConnection } = wallet;
        let userId = walletConnection.getAccountId();
        contract
            ?.get_available_time?.({
                userId: userId,
            })
            .then((data) => {
                setTime(JSON.parse(atob(data)));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getMeetingFee = () => {
        const { contract, walletConnection } = wallet;
        let userId = walletConnection.getAccountId();
        contract
            ?.get_meeting_fee?.({
                userId: userId,
            })
            .then((total) => {
                if (total !== null && total !== 0 && total !== '0') {
                    let fee = utils.format.formatNearAmount(total);
                    setCurrentMeetingFee(fee);
                    setFree(false);
                } else {
                    setFree(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetPendingRequestRows = () => {
        const { contract, walletConnection } = wallet;
        let userId = walletConnection.getAccountId();
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
        const { contract, walletConnection } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        let userId = walletConnection.getAccountId();
        let tmpNotify = [];
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
                                let duration = (parseFloat(requets.end_date) - parseFloat(requets.start_date)) / (60 * 1000);
                                let rqObj = {
                                    id: requets.id,
                                    title: `Meeting request from ${requets.requestor}`,
                                    description: requets.description,
                                    duration: `${duration} minutes`,
                                    name: requets.name,
                                    email: requets.email,
                                };
                                tmpNotify.push(rqObj);
                            });
                        }
                    });
            }),
        ).then(() => {
            setNotify([...tmpNotify]);
        });
    };

    const onGetMaxRows = () => {
        const { contract, walletConnection } = wallet;
        let userId = walletConnection.getAccountId();
        if (routerId) {
            userId = routerId;
        }
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
        const { contract, walletConnection } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        const accountId = walletConnection.getAccountId();
        let tmpUcmMeetings = [];
        let tmpPstMeetings = [];
        const current_timestamp = Date.now();
        let userId = walletConnection.getAccountId();
        if (routerId) {
            userId = routerId;
        }
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
                                if (event && event.is_published) {
                                    let summary = event.name;
                                    if (event.event_type === EVENT_TYPE.MEETING_REQUEST) {
                                        summary = summary.split('[Meeting]')[1];
                                        let name_prefix = event.owner;
                                        if (event.owner === accountId) {
                                            name_prefix = event.participants[0];
                                        }
                                        let eventDescription = '';
                                        event?.description?.map((des, index) => {
                                            eventDescription = eventDescription + des + '\n';
                                        });
                                        summary = `[Meeting with ${name_prefix}] ${summary}`;
                                        let mt_start_time = new Date(parseFloat(event.start_date));
                                        let mt_end_time = new Date(parseFloat(event.end_date));

                                        let meeting = {
                                            id: event.id,
                                            title: `Meeting in ${mt_start_time.toString().split('GMT')[0]}`,
                                            time: `${mt_start_time.toString().split(' ')[4].split(':').slice(0, -1).join(':')} - ${mt_end_time
                                                .toString()
                                                .split(' ')[4]
                                                .split(':')
                                                .slice(0, -1)
                                                .join(':')}`,
                                            date: DAY_NAME[mt_start_time.getDay()],
                                            description: eventDescription,
                                            duration: `${(parseFloat(event.end_date) - parseFloat(event.start_date)) / (60 * 1000)} minutes`,
                                            name: event.name.split('[Meeting] ')[1],
                                            email: event.url,
                                            date_timestamp: event.start_date,
                                            is_claimed: event.is_claimed,
                                        };
                                        if (current_timestamp >= parseFloat(event.end_date)) {
                                            tmpPstMeetings.push(meeting);
                                        } else {
                                            tmpUcmMeetings.push(meeting);
                                        }
                                        // meetings.push(meeting);
                                    }
                                    let eventInfo = {
                                        id: event.id,
                                        startAt: new Date(parseFloat(event.start_date)).toISOString(),
                                        endAt: new Date(parseFloat(event.end_date)).toISOString(),
                                        summary: userId === accountId ? summary : 'Busy',
                                        color: userId === accountId ? colorList[Math.floor(Math.random() * colorList.length)] : 'orange',
                                    };
                                    events.push(eventInfo);
                                }
                            });
                            setEventsList([...events]);
                            // setMeetingsList([...meetings]);
                        }
                    });
            }),
        ).then(() => {
            tmpPstMeetings.sort((a, b) => {
                return b.date_timestamp - a.date_timestamp;
            });
            tmpUcmMeetings.sort((a, b) => {
                return a.date_timestamp - b.date_timestamp;
            });
            setMeetingsPstList([...tmpPstMeetings]);
            setMeetingsUcmList([...tmpUcmMeetings]);
        });
    };

    const onNewEventClick = (data) => {
        const msg = `New event click action\n\n Callback data:\n\n${JSON.stringify({
            hour: data.hour,
            day: data.day,
            event: 'click event ',
        })}`;
        console.log(msg);
    };

    const onEventClick = (data) => {
        const msg = `Click on event action\n\n Callback data:\n\n${JSON.stringify(data)}`;
        console.log(msg);
        router.push(`/event/event-detail?id=${data.id}`);
    };

    const onEventDragFinish = (prev, current, data) => {
        setEventsList(data);
    };

    const onCreateEventClick = () => {
        const { walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        if (userId === '') {
            onRequestConnectWallet();
        }
        router.push('/event/create-event');
    };

    const onShareCalendarClick = () => {
        if (!router.query.id) {
            const { contract, walletConnection } = wallet;
            const accountId = walletConnection.getAccountId();
            if (accountId !== '') {
                const uri = new URL(window.location.href);
                const { origin } = uri;
                setLink(`${origin}/calendar?id=${accountId}`);
                setLink({ link: `${origin}/calendar?id=${accountId}`, name: accountId });
                setModalShare(true);
            } else {
                onRequestConnectWallet();
            }
        } else {
            router.push(`/calendar/calendar-other?id=${router.query.id}`);
        }
    };

    const onRequestConnectWallet = () => {
        const { nearConfig, walletConnection } = wallet;
        walletConnection?.requestSignIn?.(nearConfig?.contractName);
    };

    const generateMessage = () => {
        let message = 'This NEAR Account not available';
        if (eventsList !== [] && routerId) {
            message = `You are watching ${routerId}'s timeline`;
        } else {
            return null;
        }
        return (
            <div className={styles.label_title}>
                <br />
                {message}
            </div>
        );
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

    const onCloseModalShare = () => {
        setModalShare(false);
    };

    const onSuccess = () => {
        onShowResult({
            type: 'success',
            msg: 'copied',
        });
    };

    const onResponseMeetingRequest = (id, status) => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        setModal(false);
        setOpenLoading(true);

        contract
            ?.response_meeting_request(
                {
                    id: id,
                    approve: status,
                },
                300000000000000,
            )
            .then((res) => {
                setOpenLoading(false);
                if (status) {
                    onShowResult({
                        type: 'success',
                        msg: 'Meeting request confirmed',
                    });
                } else {
                    onShowResult({
                        type: 'success',
                        msg: 'Meeting request has been denied',
                    });
                }
                setTimeout(() => {
                    router.reload();
                }, 3000);
            })
            .catch((err) => {
                onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    const generateNotify = () => {
        let color = 'black';
        if (notify.length > 0) {
            color = 'red';
        }
        return (
            <button className={styles.button_area_share} onClick={onNotifyClick}>
                <NotificationsActiveOutlinedIcon style={{ color: color }} /> {`(${notify.length})`}
            </button>
        );
    };

    const generateButton = (id) => {
        if (!id) {
            return (
                <div className={styles.button_area}>
                    <button className={styles.button_area_button} onClick={onCreateEventClick}>
                        Create Event
                    </button>
                    <button className={styles.button_area_button} style={{ marginLeft: 10 }} onClick={onShareCalendarClick}>
                        Share Your Calendar
                    </button>
                    {/* <button className={styles.button_area_share} onClick={onNotifyClick}>
                    <NotificationsActiveOutlinedIcon style={{ color: 'red' }} /> (1)
                </button> */}
                    {/* {generateNotify()} */}
                    <button className={styles.button_area_setting} onClick={onSettingClick}>
                        <SettingsOutlinedIcon />
                    </button>
                </div>
            );
        } else {
            return (
                <div className={styles.button_area}>
                    <button className={styles.button_area_button} style={{ marginLeft: 10 }} onClick={onShareCalendarClick}>
                        Book a Meeting
                    </button>
                </div>
            );
        }
    };

    const onNotifyClick = () => {
        setModal(true);
    };

    const onCloseModal = () => {
        setModal(false);
    };

    const onSettingClick = () => {
        setModalSetting(true);
    };

    const onCloseModalSetting = () => {
        setModalSetting(false);
    };

    const onFeeChange = (e) => {
        setCurrentMeetingFee(e.target.value);
        // setFee(e.target.value);
    };

    const updateSetting = () => {
        const { contract } = wallet;
        let yocto_enroll_fee = utils.format.parseNearAmount(`${currentMeetingFee}`);
        setModalSetting(false);
        setOpenLoading(true);
        let ava_time = btoa(JSON.stringify(time));

        contract
            ?.update_calendar_setting?.({
                meeting_fee: yocto_enroll_fee,
                available_time: ava_time,
            })
            .then((res) => {
                if (res) {
                    onShowResult({
                        type: 'success',
                        msg: 'Update setting success',
                    });
                } else {
                    onShowResult({
                        type: 'error',
                        msg: 'Update setting fail',
                    });
                }
            })
            .catch((err) => {
                onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    const renderContent = () => {
        switch (tabActive) {
            case 'calendarview':
                return (
                    <div className={styles.kalend}>
                        <Kalend
                            kalendRef={props.kalendRef}
                            onNewEventClick={onNewEventClick}
                            initialView={CalendarView.WEEK}
                            disabledViews={[]}
                            onEventClick={onEventClick}
                            events={eventsList}
                            initialDate={new Date().toISOString()}
                            hourHeight={60}
                            // timezone={'Europe/Berlin'}
                            onEventDragFinish={onEventDragFinish}
                            onStateChange={props.onStateChange}
                            selectedView={props.selectedView}
                        />
                    </div>
                );
            case 'listview':
                return renderListView();

            default:
                break;
        }
    };

    const renderListView = () => {
        const handleChange = (event, newValue) => {
            setTabInList(newValue);
        };

        const a11yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            };
        };

        const TabPanel = (props) => {
            const { children, value, index, ...other } = props;

            return (
                <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
                    {value === index && (
                        <Box sx={{ p: 2 }}>
                            <Typography>{children}</Typography>
                        </Box>
                    )}
                </div>
            );
        };

        return (
            <div className={styles.listview}>
                <div className={styles.listview_body}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabInList} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Upcoming" {...a11yProps(0)} className="simple-tab-heading" />
                                <Tab label="Past" {...a11yProps(1)} className="simple-tab-heading" />
                            </Tabs>
                        </Box>
                        <TabPanel value={tabInList} index={0}>
                            {meetingsUcmList[0]
                                ? meetingsUcmList.map((item, index) => {
                                      return (
                                          <Fragment key={index}>
                                              <EventItem
                                                  item={item}
                                                  onCancelMeeting={onCancelMeeting}
                                                  tabInList={tabInList}
                                                  onRescheduleMeeting={onRescheduleMeeting}
                                              />
                                              <div className={styles.modal_line} />
                                          </Fragment>
                                      );
                                  })
                                : 'You do not have any upcoming meeting'}
                        </TabPanel>
                        <TabPanel value={tabInList} index={1}>
                            {meetingsPstList[0]
                                ? meetingsPstList.map((item, index) => {
                                      return (
                                          <Fragment key={index}>
                                              <EventItem
                                                  item={item}
                                                  onCancelMeeting={onCancelMeeting}
                                                  tabInList={tabInList}
                                                  onRescheduleMeeting={onRescheduleMeeting}
                                              />
                                              <div className={styles.modal_line} />
                                          </Fragment>
                                      );
                                  })
                                : 'You do not have any meetings before'}
                        </TabPanel>
                    </Box>
                </div>
            </div>
        );
    };

    const onCheckTime = (check, item) => {
        let tmp = [...time];
        tmp[item.id] = { ...item, check };
        setTime(tmp);
    };

    const onChangeStartTime = (e, item) => {
        let tmp = [...time];
        tmp[item.id] = { ...item, startTime: e.target.value || item.startTime };
        setTime(tmp);
    };

    const onChangeEndTime = (e, item) => {
        let tmp = [...time];
        tmp[item.id] = { ...item, endTime: e.target.value || item.startTime };
        setTime(tmp);
    };

    const onCancelMeeting = (eventId) => {
        const { contract } = wallet;

        setOpenLoading(true);

        contract
            ?.unpublish_event?.(
                {
                    eventId: eventId,
                },
                100000000000000,
            )
            .then((res) => {
                if (res) {
                    setOpenLoading(false);
                    onShowResult({
                        type: 'success',
                        msg: 'Your meeting has been cancelled',
                    });
                } else {
                    onShowResult({
                        type: 'error',
                        msg: 'Somethings went wrong, please try again!',
                    });
                }
            })
            .catch((err) => {
                onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    const onRescheduleMeeting = (item) => {
        const { walletConnection } = wallet;
        const accountId = walletConnection.getAccountId();
        router.push(`/calendar/calendar-other?id=${accountId}&event_id=${item}`);
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                {generateMessage()}
                <div className={styles.rowbtn}>
                    <div className={styles.rowbtn_tab}>
                        {tab.map((item) => {
                            return (
                                <button
                                    className={tabActive === item.id ? styles.rowbtn_tab_btn_active : styles.rowbtn_tab_btn}
                                    onClick={() => setTabActive(item.id)}
                                    key={item.id}
                                >
                                    <item.icon />
                                    {item.title}
                                </button>
                            );
                        })}
                    </div>
                    {generateButton(router.query.id)}
                </div>

                {renderContent()}

                {modalShare && <ModalShare link={link} onCloseModal={onCloseModalShare} onSuccess={onSuccess} />}

                {/* <Modal open={modal} onClose={onCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
                            Your Pending Meeting Requests
                        </Typography>
                        <div className={styles.modal}>
                            {notify.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        <NotifyItem item={item} onResponseMeetingRequest={onResponseMeetingRequest} />
                                        <div className={styles.modal_line} />
                                    </Fragment>
                                );
                            })}
                        </div>
                    </Box>
                </Modal> */}

                <Modal open={modalSetting} onClose={onCloseModalSetting} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
                            Setting
                        </Typography>
                        <div className={styles.modal}>
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Invite Question</div>
                            </div>
                            <div className={styles.modal_line} />
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>When people can book the meeting?</div>
                            </div>
                            <div className={styles.modal_line} />
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Set fee for book a meeting</div>
                            </div>
                            <div className={styles.modal_fee_row}>
                                <button className={free ? styles.modal_fee_button_active : styles.modal_fee_button} onClick={() => setFree(true)}>
                                    Free
                                </button>
                                <button className={!free ? styles.modal_fee_button_active : styles.modal_fee_button} onClick={() => setFree(false)}>
                                    Paid
                                </button>
                                {!free && (
                                    <input
                                        className={styles.modal_fee_input}
                                        type={'number'}
                                        onChange={onFeeChange}
                                        placeholder={
                                            currentMeetingFee !== 0 ? `Current Fee: ${currentMeetingFee} NEAR` : 'The amount need to be paid for a booking'
                                        }
                                    />
                                )}
                            </div>
                            <div className={styles.modal_line} />
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>Add trust people</div>
                            </div>
                            <div className={styles.modal_line} />
                            <div className={styles.modal_row}>
                                <div className={styles.modal_row_label}>How do you want to offer your availability for this event type?</div>
                            </div>
                            <div>Set your weekly hours</div>
                            <div className={styles.modal_time}>
                                <FormGroup>
                                    {time.map((item, index) => {
                                        return (
                                            <Fragment key={index}>
                                                {index !== 0 && <div className={styles.modal_line} />}
                                                <div className={styles.modal_time_row}>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={item.check} />}
                                                        label={item.label}
                                                        style={{ width: 100 }}
                                                        onChange={(e) => onCheckTime(e.target.checked, item)}
                                                    />
                                                    {item.check ? (
                                                        <div className={styles.modal_time_row_area}>
                                                            <input
                                                                type={'time'}
                                                                className={styles.modal_time_row_input}
                                                                value={item.startTime}
                                                                onChange={(e) => onChangeStartTime(e, item)}
                                                            />
                                                            <span>-</span>
                                                            <input
                                                                type={'time'}
                                                                className={styles.modal_time_row_input}
                                                                value={item.endTime}
                                                                onChange={(e) => onChangeEndTime(e, item)}
                                                            />
                                                            <div className={styles.modal_time_row_delete} onClick={() => onCheckTime(false, item)}>
                                                                <DeleteOutlinedIcon fontSize="medium" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.modal_time_row_area}>Unavailable</div>
                                                    )}
                                                    <div className={styles.modal_time_row_add} onClick={() => onCheckTime(true, item)}>
                                                        <AddOutlinedIcon fontSize="large" />
                                                    </div>
                                                </div>
                                            </Fragment>
                                        );
                                    })}
                                </FormGroup>
                            </div>
                        </div>
                        <div className={styles.modal_row_button}>
                            <button className={styles.modal_row_button_cancel} onClick={() => setModalSetting(false)}>
                                Cancel
                            </button>
                            <button className={styles.modal_row_button_create} onClick={updateSetting}>
                                Save
                            </button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

const NotifyItem = (props) => {
    const { item, onResponseMeetingRequest } = props;
    const [expand, setExpand] = useState(false);

    return (
        <>
            <div className={styles.modal_row} onClick={() => setExpand(!expand)}>
                <div className={styles.modal_row_label}>{item.title}</div>
                {expand ? <ArrowDropDownOutlinedIcon fontSize="large" /> : <ArrowRightOutlinedIcon fontSize="large" />}
                <button className={styles.modal_row_accept} onClick={() => onResponseMeetingRequest(item.id, true)}>
                    Accept
                </button>
                <button className={styles.modal_row_deny} onClick={() => onResponseMeetingRequest(item.id, false)}>
                    Deny
                </button>
            </div>
            {expand && (
                <div className={styles.modal_content}>
                    <div className={styles.modal_content_text}>Description: {item.description}</div>
                    <div className={styles.modal_content_text}>Duration: {item.duration}</div>
                    <div className={styles.modal_content_text}>Name: {item.name}</div>
                    <div className={styles.modal_content_text}>Email: {item.email}</div>
                </div>
            )}
        </>
    );
};

const EventItem = (props) => {
    const { item, onCancelMeeting, tabInList, onRescheduleMeeting } = props;
    const router = useRouter();
    const [expand, setExpand] = useState(false);
    return (
        <>
            <div className={styles.listview_row_date}>{item.date}</div>
            <div className={styles.listview_row} onClick={() => setExpand(!expand)}>
                <div className={styles.listview_row_time}>{item.time}</div>
                <div className={styles.listview_row_detail}>
                    <div className={styles.listview_row_detail_title}>{item.title}</div>
                </div>
                {expand ? <ArrowDropDownOutlinedIcon fontSize="large" /> : <ArrowRightOutlinedIcon fontSize="large" />}
            </div>
            {expand && (
                <div className={styles.listview_content}>
                    <div className={styles.listview_content_left}>
                        {!tabInList && (
                            <div>
                                <button
                                    className={styles.listview_content_left_btn}
                                    onClick={() => {
                                        onRescheduleMeeting(item.id);
                                    }}
                                >
                                    <CachedOutlinedIcon />
                                    Reschedule
                                </button>
                                <button
                                    className={styles.listview_content_left_btn}
                                    onClick={() => {
                                        onCancelMeeting(item.id);
                                    }}
                                >
                                    <CloseOutlinedIcon />
                                    Cancel
                                </button>
                            </div>
                        )}
                        {!!tabInList && (
                            <div>
                                <button
                                    className={styles.listview_content_left_btn}
                                    onClick={() => {
                                        router.push(`/event/event-detail?id=${item.id}`);
                                    }}
                                    disabled={item.is_claimed}
                                >
                                    <CachedOutlinedIcon />
                                    {!item.is_claimed ? 'Claim Reward' : 'Claimed'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={styles.listview_content_right}>
                        <div className={styles.listview_content_text}>Description: {item.description}</div>
                        <div className={styles.listview_content_text}>Duration: {item.duration}</div>
                        <div className={styles.listview_content_text}>Name: {item.name}</div>
                        <div className={styles.listview_content_text}>Email: {item.email}</div>
                    </div>
                </div>
            )}
        </>
    );
};

const tab = [
    { id: 'listview', title: 'List view', icon: FormatListBulletedOutlinedIcon },
    { id: 'calendarview', title: 'Calendar view', icon: DateRangeOutlinedIcon },
];

const aEvents = [
    {
        title: 'Meeting in Wednesday, October 24 10:00',
        time: '09h00 - 09h30',
        date: 'Thursday, 28 April 2022',
        description: 'Daily meeting',
        duration: '30 minutes',
        name: 'Nguyen Trung Duc',
        email: 'ducnt00622@gmail.com',
    },
    {
        title: 'Daily meeting in Wednesday, October 24 10:00',
        time: '09h00 - 09h30',
        date: 'Thursday, 28 April 2022',
        description: 'Daily meeting',
        duration: '30 minutes',
        name: 'Nguyen Trung Duc',
        email: 'ducnt00622@gmail.com',
    },
    {
        title: 'Daily meeting in Wednesday, October 24 10:00',
        time: '09h00 - 09h30',
        date: 'Thursday, 28 April 2022',
        description: 'Daily meeting',
        duration: '30 minutes',
        name: 'Nguyen Trung Duc',
        email: 'ducnt00622@gmail.com',
    },
];

export default Calendar;
