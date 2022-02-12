import { useState, useLayoutEffect } from 'react';
import styles from './MyEvent.module.scss';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Notify from '../../../components/Notify';

const MyEvent = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [eventList, setEventList] = useState([]);
    const [pastEventList, setPastEventList] = useState([]);
    const [upcomingEventList, setUpcomingEventList] = useState([]);
    const [isInterest, setIsInterest] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');

    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();

    const aEvents = [
        // {
        //     id: 1,
        //     name: 'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club',
        //     type: 'Online',
        //     date: 'Sat, Jan 15 @ 5:30 PM',
        //     attendees: 16,
        // },
        // { id: 2, name: '© 2021 Learn NEAR Club', type: 'Online + In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 66 },
    ];

    const pastEvents = [];
    const upcomingEvents = [];

    useLayoutEffect(() => {
        onGetMaxRows();
    }, []);

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenSnack(true);
        setOpenLoading(false);
        setAlertType(type);
        setSnackMsg(msg);
    };

    const onGetMaxRows = () => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
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

    const onExportDateTime = (datetime) => {
        try {
            const timestamp = parseFloat(datetime);
            const date = new Date(timestamp);
            const localDate = date.toLocaleDateString();
            const localTime = date.toLocaleTimeString();
            return `${localDate} @ ${localTime}`;
        } catch {
            return 'unknow';
        }
    };

    const onGetRows = async ({ total }) => {
        const { contract, walletConnection } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        const userId = walletConnection.getAccountId();
        const current_timestamp = Date.now();
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
                                let event_type = 'Online';
                                switch (event.event_type) {
                                    case 1:
                                        event_type = 'In person';
                                        break;
                                    case 2:
                                        event_type = 'Online + In person';
                                        break;
                                }
                                let eventInfo = {
                                    id: event.id,
                                    name: event.name,
                                    type: event_type,
                                    date: onExportDateTime(event.start_date),
                                    attendees: event.participants.length,
                                };
                                aEvents.push(eventInfo);
                                if (current_timestamp >= event.end_date) {
                                    pastEvents.push(eventInfo);
                                } else {
                                    upcomingEvents.push(eventInfo);
                                }
                            });
                            // setEventList([...aEvents]);
                            setUpcomingEventList(upcomingEvents);
                            setPastEventList(pastEvents);
                            setEventList([...upcomingEvents]);
                        }
                    });
            }),
        );
    };

    const onEventItemClick = (id) => {
        router.push(`/event/event-detail?id=${id}`);
    };

    const onGetSharedLink = (id) => {
        const uri = new URL(window.location.href);
        const { origin } = uri;
        navigator.clipboard.writeText(`${origin}/event/event-detail?id=${id}`);
        onShowResult({
            type: 'success',
            msg: 'copied',
        });
    };

    const onEventFavoriteClick = (id) => {
        const { contract } = wallet;
        setOpenLoading(true);
        if (!isInterest) {
            contract
                ?.interest_event(
                    {
                        eventId: id,
                    },
                    50000000000000,
                )
                .then((res) => {
                    if (res) {
                        onShowResult({
                            type: 'success',
                            msg: 'Interested',
                        });
                    } else {
                        onShowResult({
                            type: 'error',
                            msg: 'Error when interested',
                        });
                    }
                })
                .catch((err) => {
                    onShowResult({
                        type: 'error',
                        msg: String(err),
                    });
                });
            setIsInterest(true);
        } else {
            contract
                ?.not_interest_event(
                    {
                        eventId: id,
                    },
                    50000000000000,
                )
                .then((res) => {
                    if (res) {
                        onShowResult({
                            type: 'success',
                            msg: 'Disinterested',
                        });
                    } else {
                        onShowResult({
                            type: 'error',
                            msg: 'Error when disinterested',
                        });
                    }
                })
                .catch((err) => {
                    onShowResult({
                        type: 'error',
                        msg: String(err),
                    });
                });
            setIsInterest(false);
        }
    };

    const onUpcomingTabClick = () => {
        setActiveTab('upcoming');
        setEventList([...upcomingEventList]);
    };

    const onPastTabClick = () => {
        setActiveTab('past');
        setEventList([...pastEventList]);
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.left_menu}>
                    <div className={styles.left_menu_row}>
                        <button
                            className={activeTab === 'upcoming' ? styles.left_menu_button_active : styles.left_menu_button}
                            onClick={() => onUpcomingTabClick()}
                        >
                            Upcoming
                        </button>
                        <button className={activeTab === 'past' ? styles.left_menu_button_active : styles.left_menu_button} onClick={() => onPastTabClick()}>
                            Past
                        </button>
                    </div>
                    <div className={styles.left_menu_content}>
                        {activeTab === 'upcoming' ? (
                            <>
                                <div className={styles.left_menu_row}>
                                    <input type="checkbox" id="attending" name="attending" value="attending" />
                                    <label htmlFor="attending" className={styles.left_menu_label}>
                                        Attending
                                    </label>
                                </div>
                                <div className={styles.left_menu_row}>
                                    <input type="checkbox" id="saved" name="saved" value="saved" />
                                    <label htmlFor="saved" className={styles.left_menu_label}>
                                        Saved
                                    </label>
                                </div>
                            </>
                        ) : (
                            <div className={styles.left_menu_content_text}>You're attend {pastEvents.length} events in the past</div>
                        )}
                        <div className={styles.left_menu_content_link} onClick={() => router.push('/event/calendar')}>
                            Go to calendar
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.content_title}>Your Event</div>
                    <div className={styles.content_today}>Today, January 17, 2022</div>
                    <div className={styles.line} />
                    {eventList?.length > 0 ? (
                        <div className={styles.content_event}>
                            {eventList?.map?.((item) => {
                                return (
                                    <div className={styles.content_event_item} key={item.id}>
                                        <img src={'/calendar.svg'} className={styles.content_event_item_img} alt="img" />
                                        <div className={styles.content_event_item_info} onClick={() => onEventItemClick(item.id)}>
                                            <div className={styles.content_event_item_date}>{item.date}</div>
                                            <div className={styles.content_event_item_name}>{item.name}</div>
                                            <div className={styles.content_event_item_attendees}>{item.attendees} attendees</div>
                                            <div className={styles.content_event_item_attending}>
                                                <CheckCircleOutlineOutlinedIcon />
                                                Attending
                                            </div>
                                        </div>
                                        <div className={styles.content_event_item_share}>
                                            <ShareOutlinedIcon className={styles.content_event_item_icon} onClick={() => onGetSharedLink(item.id)} />
                                            <FavoriteBorderIcon
                                                className={styles.content_event_item_icon_favor}
                                                onClick={() => onEventFavoriteClick(item.id)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.content_event_nothing}>No thing to display</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyEvent;
