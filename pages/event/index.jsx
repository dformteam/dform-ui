import { useState, useLayoutEffect, useEffect } from 'react';
import styles from './Event.module.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/router';
import ModalShare from '../../components/Share';
import { useSelector } from 'react-redux';
import { display } from '@mui/system';
import Notify from '../../components/Notify';
import { Web3Storage } from 'web3.storage';

const Event = () => {
    const router = useRouter();
    const [type, setType] = useState('both');
    const [modalShare, setModalShare] = useState(false);
    const [searchEventValue, setSearchEventValue] = useState('');
    const [eventList, setEventList] = useState([]);
    const [newestEventList, setNewestEventList] = useState([]);
    const [nextEvent, setNextEvent] = useState({});
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [link, setLink] = useState('');
    const [isInterestedLoad, setIsInterestedLoad] = useState(false);
    const [interestList, setInterestList] = useState([]);

    const wallet = useSelector((state) => state.wallet);

    const aEvents = [
        // {
        //     id: 1,
        //     name: 'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club',
        //     type: 'Online',
        //     date: 'Sat, Jan 15 @ 5:30 PM',
        //     attendees: 16,
        // },
        // { id: 2, name: '© 2021 Learn NEAR Club', type: 'Online + In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 66 },
        // { id: 3, name: 'Event 3', type: 'In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
        // { id: 4, name: 'Event 4', type: 'Online', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
    ];

    const newestEvents = [];

    useEffect(() => {
        if ((JSON.stringify(newestEventList) !== '[]') && (!isInterestedLoad)) {
            onGetMaxInterestedRows();
            setIsInterestedLoad(true);
        }
    }, [newestEventList]);


    useLayoutEffect(() => {
        onGetMaxRows();
    }, []);

    useLayoutEffect(() => {
        onGetNewestEvents();
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

    useEffect(() => {
        let ls = [];
        if (nextEvent !== {}) {
            ls.push(nextEvent);
            retrieveImagesCover(ls);
        }
    }, [nextEvent]);

    useEffect(() => {
        if (newestEventList !== []) {
            retrieveImagesCover(newestEventList);
        }
    }, [newestEventList]);

    useEffect(() => {
        if (interestList !== []) {
            interestList.map((item) => {
                setNewestEventList([...newestEventList].map((event) => {
                    if (event.id === item) {
                        event.isInterested = true;
                    }
                    return event;
                }));
            })
        }
    }, [interestList]);

    const retrieveImagesCover = async (list_event) => {
        await Promise.all(
            list_event.map(async (event) => {
                return new Promise(async (resolve, reject) => {
                    if (!event.cover_image || (event.cover_image == '')) {
                        resolve(event);
                    }
                    const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_w3key });
                    const res = await client.get(event.cover_image);
                    if (res.ok) {
                        const files = await res.files();
                        for (const file of files) {
                            let reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = (e) => {
                                event.img = e.target.result;
                                resolve(event);
                            };
                        }
                    } else {
                        resolve(event);
                    }
                })
            }),
        )
    }

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
        const current_timestamp = Date.now();
        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_interested_events({
                        userId,
                        page: index + 1,
                    })
                    .then((data) => {
                        if (data) {
                            let listId = [];
                            data.data.map((event) => {
                                listId.push(event.id);
                            });
                            setInterestList(listId);
                        }
                    });
            }),
        );
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
        }
        let eventInfo = {
            id: event.id,
            name: event.name,
            type: event_type,
            date: onExportDateTime(event.start_date),
            date_timestamp: event.start_date,
            attendees: event.participants.length,
            cover_image: event.cover_image,
            img: '/calendar.svg',
            isInterested: false
        };
        return eventInfo;
    }

    const onGetNewestEvents = () => {
        let isMounted = true;
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        contract
            ?.get_newest_events?.({})
            .then(async (newest_events) => {
                if (newestEvents) {
                    await newest_events.data.map(async (event) => {
                        let eventInfo = generateEvent(event);
                        newestEvents.push(eventInfo);
                    });
                    newestEvents.sort(function (a, b) {
                        return b.date_timestamp - a.date_timestamp;
                    });
                    if (isMounted) {
                        setNewestEventList([...newestEvents]);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            isMounted = false;
        };
    };

    const onEventFavoriteClick = (item) => {
        const { contract } = wallet;
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
                    item.isInterested = (res == 'Interested' ? true : false);
                    setNewestEventList([...newestEventList].map((event) => {
                        if (event.id === item.id) {
                            return item;
                        } else {
                            return event;
                        }
                    }));
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
                            let current_event = {};
                            current_event.img = '/calendar.svg';
                            let dt = -1;
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
                                    cover_image: event.cover_image,
                                    // img: '/calendar.svg'
                                };
                                aEvents.push(eventInfo);
                                let tmp_dt = current_timestamp - event.start_date;
                                if (dt == -1) {
                                    dt = tmp_dt;
                                    // current_event = event;
                                } else if (tmp_dt < dt) {
                                    dt = tmp_dt;
                                    // current_event = event;
                                }
                                current_event = {
                                    id: event.id,
                                    name: event.name,
                                    type: event_type,
                                    start_date: event.start_date,
                                    date: onExportDateTime(event.start_date),
                                    attendees: event.participants.length,
                                    cover_image: event.cover_image,
                                    img: '/calendar.svg'
                                }
                            });
                            setNextEvent(current_event);
                            if (eventList.length < 9) {
                                setEventList([...aEvents]);
                            }
                        }
                    });
            }),
        );
    };

    const onTypeChange = (e) => {
        setType(e.target.value);
    };

    const renderInterestedIcon = (item) => {
        if (item.isInterested) {
            return (
                <FavoriteIcon className={styles.event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />
            )
        } else {
            return (
                <FavoriteBorderIcon className={styles.event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />
            )
        }
    }

    const renderEventItem = (item) => {
        return (
            <div className={styles.event_item} key={item.id}>
                <div className={styles.event_item_header}>
                    <div className={styles.event_item_type}>{item.type}</div>
                    {/* <img src={'/calendar.svg'} className={styles.event_item_img} alt="img" onClick={() => router.push(`/event/event-detail?id=${item.id}`)} /> */}
                    <img src={item.img} className={styles.event_item_img} alt="img" onClick={() => router.push(`/event/event-detail?id=${item.id}`)} />
                </div>
                <div className={styles.event_item_info}>
                    <div className={styles.event_item_date}>{item.date}</div>
                    <div className={styles.event_item_name} onClick={() => router.push(`/event/event-detail?id=${item.id}`)}>
                        {item.name}
                    </div>
                    <div className={styles.event_item_footer}>
                        <div className={styles.event_item_attendees}>{item.attendees} attendees</div>
                        <ShareOutlinedIcon className={styles.event_item_icon} onClick={() => {
                            onGetSharedLink(item.id)
                        }} />
                        {renderInterestedIcon(item)}
                    </div>
                </div>
            </div>
        );
    };

    const onCreateEvent = () => {
        router.push('/event/create-event');
    };

    const onCloseModalShare = () => {
        setModalShare(false);
    };

    const onSearchEvent = (id) => {
        if (id != '') {
            router.push(`/event/event-detail?id=${id}`);
        }
    };

    const onGetSharedLink = (id) => {
        const uri = new URL(window.location.href);
        const { origin } = uri;
        setLink(`${origin}/event/event-detail?id=${id}`);
        setModalShare(true);
    };

    const onSuccess = () => {
        onShowResult({
            type: 'success',
            msg: 'copied',
        });
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.label_create}>Start to create your event</div>
                <button className={styles.button_create} onClick={onCreateEvent}>
                    Create Event
                </button>
                <div style={{ visibility: nextEvent.id == null ? 'hidden' : 'visible' }}>
                    <div className={styles.label}>
                        <div className={styles.label_title}>Your next event</div>
                        <div className={styles.label_text} onClick={() => router.push('/event/my-event')}>
                            More events you're attending <ChevronRightOutlinedIcon className={styles.icon_collapse} />
                        </div>
                    </div>
                    <div className={styles.line} />
                    <div className={styles.attend_event}>
                        <div className={styles.attend_item_header}>
                            <div className={styles.attend_item_type}>{'Online'}</div>
                            <img src={nextEvent.img} className={styles.attend_item_img} alt="img" />
                        </div>
                        <div className={styles.attend_item_info} onClick={() => router.push(`/event/event-detail?id=${nextEvent.id}`)}>
                            {/* <div className={styles.attend_item_date}>{'Sat, Jan 15 @ 5:30 PM'}</div> */}
                            {/* <div className={styles.attend_item_name}>{'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club'}</div> */}
                            <div className={styles.attend_item_date}>{onExportDateTime(nextEvent.start_date)}</div>
                            <div className={styles.attend_item_name}>{nextEvent.name}</div>
                        </div>
                        <div className={styles.attend_item_footer}>
                            <div className={styles.attending}>
                                <CheckCircleIcon className={styles.attending_icon} />
                                Attending
                            </div>
                            <ShareOutlinedIcon className={styles.attend_item_icon} onClick={() => onGetSharedLink(nextEvent.id)} />
                        </div>
                    </div>
                </div>
                <div className={styles.label}>
                    <div className={styles.label_title}>Find your event</div>
                </div>
                <div className={styles.search_row}>
                    <div className={styles.search_area}>
                        <input
                            placeholder={'Find your event'}
                            className={styles.input_search}
                            value={searchEventValue}
                            onChange={(e) => {
                                setSearchEventValue(e.currentTarget.value);
                            }}
                        />
                        <SearchIcon className={styles.search_icon} />
                    </div>
                    {/* <input className={styles.input_location} placeholder={'Location'} />
                    <Select value={type} onChange={onTypeChange} className={styles.button_select} inputProps={{ 'aria-label': 'Without label' }} displayEmpty>
                        <MenuItem value={'both'}>Online + In person</MenuItem>
                        <MenuItem value={'online'}>Online</MenuItem>
                        <MenuItem value={'inPerson'}>In person</MenuItem>
                    </Select>
                    <input type={'date'} className={styles.input_location} placeholder={'Date'} /> */}
                    <button className={styles.button_search} onClick={() => onSearchEvent(searchEventValue)}>
                        Search
                    </button>
                </div>
                <div className={styles.label}>
                    <div className={styles.label_title}>Attend upcoming events</div>
                    <div className={styles.label_text} onClick={() => router.push('/event/more-events')}>
                        More events <ChevronRightOutlinedIcon className={styles.icon_collapse} />
                    </div>
                </div>
                <div className={styles.line} />
                <div className={styles.list_event}>{newestEventList.map((item) => renderEventItem(item))}</div>

                {modalShare && <ModalShare link={link} onCloseModal={onCloseModalShare} onSuccess={onSuccess} />}
            </div>
        </>
    );
};

export default Event;
