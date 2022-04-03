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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 800,
    bgcolor: '#fff',
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    paddingTop: '20px',
};

const Calendar = (props) => {
    const events = [];
    const router = useRouter();
    const colorList = ['red', 'blue', 'orange', 'green', 'violet'];
    const [demoEvents, setDemoEvents] = useState(events);
    const wallet = useSelector((state) => state.wallet);
    const [link, setLink] = useState({ link: '', name: '' });
    const [modalShare, setModalShare] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [routerId, setRouterId] = useState('');
    const [modal, setModal] = useState(false);

    useLayoutEffect(() => {
        onGetMaxRows();
    }, [routerId]);

    useEffect(() => {
        setRouterId(router.query.id);
    }, [router]);

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
                                if (event?.is_published) {
                                    let eventInfo = {
                                        id: event.id,
                                        startAt: new Date(parseFloat(event.start_date)).toISOString(),
                                        endAt: new Date(parseFloat(event.end_date)).toISOString(),
                                        summary: userId === accountId ? event.name : 'Busy',
                                        color: userId === accountId ? colorList[Math.floor(Math.random() * colorList.length)] : 'orange',
                                    };
                                    events.push(eventInfo);
                                }
                            });
                            setDemoEvents([...events]);
                        }
                    });
            }),
        );
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
        setDemoEvents(data);
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
        const { contract, walletConnection } = wallet;
        const accountId = walletConnection.getAccountId();
        console.log('accountId => ', typeof accountId);
        if (accountId !== '') {
            const uri = new URL(window.location.href);
            const { origin } = uri;
            setLink(`${origin}/calendar?id=${accountId}`);
            setLink({ link: `${origin}/calendar?id=${accountId}`, name: accountId });
            setModalShare(true);
        } else {
            onRequestConnectWallet();
        }
    };

    const onRequestConnectWallet = () => {
        const { nearConfig, walletConnection } = wallet;
        walletConnection?.requestSignIn?.(nearConfig?.contractName);
    };

    const generateMessage = () => {
        let message = 'This NEAR Account not available';
        if (demoEvents !== [] && routerId) {
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

    const onNotifyClick = () => {
        setModal(true);
    };

    const onCloseModal = () => {
        setModal(false);
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                {generateMessage()}
                <div className={styles.button_area}>
                    <button className={styles.button_area_button} onClick={onCreateEventClick}>
                        Create Event
                    </button>
                    <button className={styles.button_area_share} onClick={onShareCalendarClick}>
                        Share Your Calendar
                    </button>
                    <button className={styles.button_area_share} onClick={onNotifyClick}>
                        <NotificationsActiveOutlinedIcon /> Notifications
                    </button>
                </div>
                <Kalend
                    kalendRef={props.kalendRef}
                    onNewEventClick={onNewEventClick}
                    initialView={CalendarView.WEEK}
                    disabledViews={[]}
                    onEventClick={onEventClick}
                    events={demoEvents}
                    initialDate={new Date().toISOString()}
                    hourHeight={60}
                    // timezone={'Europe/Berlin'}
                    onEventDragFinish={onEventDragFinish}
                    onStateChange={props.onStateChange}
                    selectedView={props.selectedView}
                />
                {modalShare && <ModalShare link={link} onCloseModal={onCloseModalShare} onSuccess={onSuccess} />}

                <Modal open={modal} onClose={onCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
                            Booking Requests
                        </Typography>
                        <div className={styles.modal}>
                            {aNotify.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        <NotifyItem item={item} />
                                        <div className={styles.modal_line} />
                                    </Fragment>
                                );
                            })}
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

const NotifyItem = (props) => {
    const { item } = props;
    const [expand, setExpand] = useState(false);

    return (
        <>
            <div className={styles.modal_row} onClick={() => setExpand(!expand)}>
                <div className={styles.modal_row_label}>{item.title}</div>
                {expand ? <ArrowDropDownOutlinedIcon /> : <ArrowRightOutlinedIcon />}
                <button className={styles.modal_row_accept}>Accept</button>
                <button className={styles.modal_row_deny}>Deny</button>
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

const aNotify = [
    {
        title: 'Daily meeting in Wednesday, October 24 10:00',
        description: 'Daily meeting',
        duration: '30 minutes',
        name: 'Nguyen Trung Duc',
        email: 'ducnt00622@gmail.com',
    },
    {
        title: 'Daily meeting in Wednesday, October 24 10:00',
        description: 'Daily meeting',
        duration: '30 minutes',
        name: 'Nguyen Trung Duc',
        email: 'ducnt00622@gmail.com',
    },
    {
        title: 'Daily meeting in Wednesday, October 24 10:00',
        description: 'Daily meeting',
        duration: '30 minutes',
        name: 'Nguyen Trung Duc',
        email: 'ducnt00622@gmail.com',
    },
];

export default Calendar;
