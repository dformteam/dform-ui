/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import styles from './MyEvent.module.scss';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Notify from '../../../components/Notify';
import ModalShare from '../../../components/Share';
import { Web3Storage } from 'web3.storage';
import FavoriteIcon from '@mui/icons-material/Favorite';

const MyEvent = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [eventList, setEventList] = useState([]);
    const [pastEventList, setPastEventList] = useState([]);
    const [upcomingEventList, setUpcomingEventList] = useState([]);

    const [interestedEventList, setInterestedEventList] = useState([]);
    const [displayInterestedEventList, setDisplayInterestedEventList] = useState([]);

    const [hostingEventList, setHostingEventList] = useState([]);
    const [upcomingHostingEventList, setUpcomingHostingEventList] = useState([]);

    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [attendingState, setAttendingState] = useState(true);
    const [pastState, setPastState] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [savedState, setSavedState] = useState(true);
    const [hostingState, setHostingState] = useState(true);
    const [modalShare, setModalShare] = useState(false);
    const [link, setLink] = useState('');

    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();

    useLayoutEffect(() => {
        onGetMaxRows();
    }, []);

    useEffect(() => {
        if (JSON.stringify(interestedEventList) !== '[]') {
            interestedEventList.map((item) => {
                if (item !== {}) {
                    setEventList(
                        [...eventList].map((event) => {
                            if (event.id == item?.id) {
                                event.isInterested = true;
                                displayInterestedEventList.splice(displayInterestedEventList.indexOf(item), 1);
                                setDisplayInterestedEventList(displayInterestedEventList);
                            }
                            return event;
                        }),
                    );

                    setPastEventList(
                        [...pastEventList].map((event) => {
                            if (event.id == item?.id) {
                                event.isInterested = true;
                                displayInterestedEventList.splice(displayInterestedEventList.indexOf(item), 1);
                                setDisplayInterestedEventList(displayInterestedEventList);
                            }
                            return event;
                        }),
                    );

                    return item;
                }
            });
        }
    }, [interestedEventList]);

    useLayoutEffect(() => {
        onGetMaxInterestedRows();
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

    const retrieveImagesCover = async (event, index, type) => {
        if (event && event.cover_image && event.cover_image !== '' && event.img === '/calendar.svg') {
            const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_w3key });
            const res = await client.get(event.cover_image);
            if (res.ok) {
                const files = await res.files();
                for (const file of files) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        event.img = e.target.result;
                        switch (type) {
                            case eventItemType.ATTENDING:
                                eventList[index] = { ...event };
                                setEventList([...eventList]);
                                break;
                            case eventItemType.HOSTING:
                                hostingEventList[index] = { ...event };
                                setHostingEventList([...hostingEventList]);
                                break;
                            case eventItemType.PAST:
                                pastEventList[index] = { ...event };
                                setPastEventList([...pastEventList]);
                                break;
                            case eventItemType.SAVE:
                                displayInterestedEventList[index] = { ...event };
                                setDisplayInterestedEventList([...displayInterestedEventList]);
                                break;
                            default:
                                break;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    const generateEvent = (event) => {
        let event_type = 'Online';
        switch (event.event_type) {
            case 1:
                event_type = 'In person';
                break;
            case 2:
                event_type = 'Online + In person';
                break;
            default:
                break;
        }

        return {
            id: event.id,
            name: event.name,
            type: event_type,
            cover_image: event.cover_image,
            img: '/calendar.svg',
            date: onExportDateTime(event.start_date),
            attendees: event.participants.length,
            date_timestamp: event.start_date,
            isInterested: false,
        };
    };

    const onGetMaxInterestedRows = () => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        contract
            ?.get_interested_event_count?.({
                userId: userId,
            })
            .then((total) => {
                onGetInterestedRows({ total });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetInterestedRows = async ({ total }) => {
        const { contract, walletConnection } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        const userId = walletConnection.getAccountId();
        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_interested_events({
                        userId,
                        page: index + 1,
                    })
                    .then((data) => {
                        if (data) {
                            let ls_itr_event = [];
                            ls_itr_event.push({});
                            data.data.map((event) => {
                                let eventInfo = generateEvent(event);
                                eventInfo.isInterested = true;
                                ls_itr_event.push(eventInfo);
                                // return event;
                            });
                            ls_itr_event.sort(function (a, b) {
                                return b.date_timestamp - a.date_timestamp;
                            });
                            setInterestedEventList([...ls_itr_event]);
                            setDisplayInterestedEventList([...ls_itr_event]);
                        }
                    });
            }),
        );
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
                            return data?.data;
                        }
                    })
                    .then((value) => {
                        let tmpHosting = [];
                        let tmpUpcoming = [];
                        let tmpPast = [];
                        value.map((event) => {
                            let eventInfo = generateEvent(event);
                            if (current_timestamp >= parseFloat(event.end_date)) {
                                tmpPast.push(eventInfo);
                            } else if (event.owner == userId) {
                                tmpHosting.push(eventInfo);
                            } else {
                                tmpUpcoming.push(eventInfo);
                            }
                        });
                        tmpUpcoming.sort((a, b) => {
                            return b.date_timestamp - a.date_timestamp;
                        });
                        tmpPast.sort((a, b) => {
                            return b.date_timestamp - a.date_timestamp;
                        });
                        tmpHosting.sort((a, b) => {
                            return b.date_timestamp - a.date_timestamp;
                        });
                        setHostingEventList([...tmpHosting]);
                        setEventList([...tmpUpcoming]);
                        setPastEventList([...tmpPast]);
                        setInterestedEventList((interestedEventList) => [...interestedEventList, {}]);
                    })
                    .catch((err) => {
                        console.log(err);
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
        setLink(`${origin}/event/event-detail?id=${id}`);
        setModalShare(true);
    };

    const onEventFavoriteClick = (item) => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        if (userId == item.owner) {
            onShowResult({
                type: 'error',
                msg: 'You are the owner of this event',
            });
            return;
        }
        setOpenLoading(true);
        contract
            ?.interest_event(
                {
                    eventId: item.id,
                },
                50000000000000,
            )
            .then((res) => {
                if (res) {
                    onShowResult({
                        type: 'success',
                        msg: res,
                    });
                    item.isInterested = res === 'Interested' ? true : false;
                    setEventList(
                        [...eventList].map((event) => {
                            if (event.id === item.id) {
                                return item;
                            } else {
                                return event;
                            }
                        }),
                    );
                    setHostingEventList(
                        [...hostingEventList].map((event) => {
                            if (event.id === item.id) {
                                return item;
                            } else {
                                return event;
                            }
                        }),
                    );
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
    };

    const onUpcomingTabClick = () => {
        setActiveTab('upcoming');
        setPastState(false);
        setSavedState(true);
        setAttendingState(true);
        setHostingState(true);
    };

    const onPastTabClick = () => {
        setActiveTab('past');
        setPastState(true);
        setAttendingState(false);
        setHostingState(false);
        setSavedState(false);
    };

    const handleAttendingCBChange = (e) => {
        let isChecked = e.target.checked;
        setAttendingState(isChecked);
    };

    const handleSavedCBChange = (e) => {
        let isChecked = e.target.checked;
        setSavedState(isChecked);
    };

    const handleHostingCBChange = (e) => {
        let isChecked = e.target.checked;
        setHostingState(isChecked);
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

    const renderInterestedIcon = (item) => {
        if (item.isInterested) {
            return <FavoriteIcon className={styles.content_event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />;
        } else {
            return <FavoriteBorderIcon className={styles.content_event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />;
        }
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
                                    <input
                                        type="checkbox"
                                        id="attending"
                                        name="attending"
                                        value="attending"
                                        checked={attendingState}
                                        onChange={(e) => handleAttendingCBChange(e)}
                                    />
                                    <label htmlFor="attending" className={styles.left_menu_label}>
                                        Attending
                                    </label>
                                </div>
                                <div className={styles.left_menu_row}>
                                    <input
                                        type="checkbox"
                                        id="saved"
                                        name="saved"
                                        value="saved"
                                        checked={savedState}
                                        onChange={(e) => handleSavedCBChange(e)}
                                    />
                                    <label htmlFor="saved" className={styles.left_menu_label}>
                                        Saved
                                    </label>
                                </div>
                                <div className={styles.left_menu_row}>
                                    <input
                                        type="checkbox"
                                        id="hosting"
                                        name="hosting"
                                        value="hosting"
                                        checked={hostingState}
                                        onChange={(e) => handleHostingCBChange(e)}
                                    />
                                    <label htmlFor="hosting" className={styles.left_menu_label}>
                                        Hosting
                                    </label>
                                </div>
                            </>
                        ) : (
                            <div className={styles.left_menu_content_text}>You're attend {pastEventList.length} events in the past</div>
                        )}
                        <div className={styles.left_menu_content_link} onClick={() => router.push('/event/calendar')}>
                            Go to calendar
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.content_title}>Your Event</div>
                    <div className={styles.content_today}>
                        Today, {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getDate()}, {new Date().getFullYear()}
                    </div>
                    <div className={styles.line} />
                    {attendingState && (
                        <div className={styles.content_event}>
                            {eventList?.map?.((item, index) => {
                                if (item && item.id) {
                                    retrieveImagesCover(item, index, eventItemType.ATTENDING);
                                    return (
                                        <EventItem
                                            item={item}
                                            label="Attending"
                                            activeTab={activeTab}
                                            onGetSharedLink={onGetSharedLink}
                                            onEventItemClick={onEventItemClick}
                                            renderInterestedIcon={renderInterestedIcon}
                                            key={item.id}
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                    {pastState && (
                        <div className={styles.content_event}>
                            {pastEventList?.map?.((item, index) => {
                                if (item && item.id) {
                                    retrieveImagesCover(item, index, eventItemType.PAST);
                                    return (
                                        <EventItem
                                            item={item}
                                            label="Attented"
                                            activeTab={activeTab}
                                            onGetSharedLink={onGetSharedLink}
                                            onEventItemClick={onEventItemClick}
                                            renderInterestedIcon={renderInterestedIcon}
                                            key={item.id}
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                    {savedState && (
                        <div className={styles.content_event}>
                            {displayInterestedEventList?.map?.((item, index) => {
                                if (item && item.id) {
                                    retrieveImagesCover(item, index);
                                    return (
                                        <EventItem
                                            item={item}
                                            label="Saved"
                                            activeTab={activeTab}
                                            onGetSharedLink={onGetSharedLink}
                                            onEventItemClick={onEventItemClick}
                                            renderInterestedIcon={renderInterestedIcon}
                                            key={item.id}
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                    {hostingState && (
                        <div className={styles.content_event}>
                            {hostingEventList?.map?.((item, index) => {
                                if (item && item.id) {
                                    retrieveImagesCover(item, index, eventItemType.HOSTING);
                                    return (
                                        <EventItem
                                            item={item}
                                            label="Hosting"
                                            activeTab={activeTab}
                                            onGetSharedLink={onGetSharedLink}
                                            onEventItemClick={onEventItemClick}
                                            renderInterestedIcon={() => {}}
                                            key={item.id}
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>

            {modalShare && <ModalShare link={link} onCloseModal={onCloseModalShare} onSuccess={onSuccess} />}
        </>
    );
};

const EventItem = (props) => {
    const { item, activeTab, label } = props;
    const router = useRouter();

    return (
        <div className={styles.content_event_item}>
            <img src={item.img} className={styles.content_event_item_img} alt="img" />
            <div className={styles.content_event_item_info} onClick={() => props.onEventItemClick(item.id)}>
                <div className={styles.content_event_item_date}>{item.date}</div>
                <div className={styles.content_event_item_name}>{item.name}</div>
                <div className={styles.content_event_item_attendees}>{item.attendees} attendees</div>
                <div className={styles.content_event_item_attending}>
                    <CheckCircleOutlineOutlinedIcon />
                    {/* {activeTab == 'past' ? 'Attended' : 'Attending'} */}
                    {label}
                </div>
            </div>
            <div className={styles.content_event_item_share}>
                <ShareOutlinedIcon className={styles.content_event_item_icon} onClick={() => props.onGetSharedLink(item.id)} />
                {/* <FavoriteBorderIcon className={styles.content_event_item_icon_favor} onClick={() => onEventFavoriteClick(item.id)} /> */}
                {props.renderInterestedIcon(item)}
            </div>
        </div>
    );
};

const eventItemType = {
    ATTENDING: 0,
    SAVE: 1,
    HOSTING: 2,
    PAST: 3,
};

export default MyEvent;
