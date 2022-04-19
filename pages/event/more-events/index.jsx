import { useState, useLayoutEffect, useEffect } from 'react';
import styles from './MoreEvent.module.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Notify from '../../../components/Notify';
import { Web3Storage } from 'web3.storage';


const MoreEvent = () => {
    const [type, setType] = useState('both');
    const [eventList, setEventList] = useState([]);
    const [isInterest, setIsInterest] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [searchEventValue, setSearchEventValue] = useState('');
    const [interestList, setInterestList] = useState([]);
    const [isInterestedLoad, setIsInterestedLoad] = useState(false);

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
        // { id: 3, name: 'Event 3', type: 'In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
        // { id: 4, name: 'Event 4', type: 'Online', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
    ];

    const onTypeChange = (e) => {
        setType(e.target.value);
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    useLayoutEffect(() => {
        onGetMaxNewestEventsRows();
    }, []);

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

    const generateEvent = (event) => {
        let event_type = 'Unknown';
        switch (event.event_type) {
            case 1:
                event_type = 'In person';
                break;
            case 2:
                event_type = 'Online + In person';
                break;
            default:
                event_type = 'Online';
                break;
        }
        return {
            id: event.id,
            owner: event.owner,
            name: event.name,
            type: event_type,
            date: onExportDateTime(event.start_date),
            end_timestamp: event.end_date,
            date_timestamp: event.start_date,
            attendees: event.participants.length,
            cover_image: event.cover_image,
            img: '/calendar.svg',
            isInterested: false,
        };
    };

    const onGetMaxNewestEventsRows = () => {
        const { contract, walletConnection } = wallet;
        contract
            ?.get_newest_events_count?.({})
            .then((total) => {
                onGetNewestEventsRows({ total });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetNewestEventsRows = async ({ total }) => {
        const { contract, walletConnection } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        let tmpNewestEvents = [];

        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_newest_events({
                        page: index + 1,
                    })
                    .then((newest_events) => {
                        if (newest_events) {
                            const now = Date.now();
                            newest_events.data.map((event) => {
                                let eventInfo = generateEvent(event);
                                if (parseFloat(eventInfo.end_timestamp) > now) {
                                    tmpNewestEvents.push(eventInfo);
                                }
                                return event;
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }),
        )
            .then(() => {
                tmpNewestEvents.sort((a, b) => {
                    return b.date_timestamp - a.date_timestamp;
                });
                // while (tmpNewestEvents.length > 5) {
                //     tmpNewestEvents.shift();
                // }
                setEventList([...tmpNewestEvents]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onShowResult = ({ type, msg }) => {
        setOpenSnack(true);
        setOpenLoading(false);
        setAlertType(type);
        setSnackMsg(msg);
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


    useEffect(() => {
        if (interestList !== []) {
            interestList.map((item) => {
                setEventList(
                    [...eventList].map((event) => {
                        if (event.id === item) {
                            event.isInterested = true;
                        }
                        return event;
                    }),
                );
                return item;
            });
        }
    }, [interestList]);

    useEffect(() => {
        if (JSON.stringify(eventList) !== '[]' && !isInterestedLoad) {
            onGetMaxInterestedRows();
            setIsInterestedLoad(true);
        }
    }, [eventList]);

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

    const onEventFavoriteClick = (item) => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        if (userId === item.owner) {
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


    const onEventItemClick = (id) => {
        router.push(`/event/event-detail?id=${id}`);
    };

    const onSearchEvent = (id) => {
        if (id != '') {
            router.push(`/event/event-detail?id=${id}`);
        }
    };

    const renderInterestedIcon = (item) => {
        if (item.isInterested) {
            return <FavoriteIcon className={styles.event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />;
        } else {
            return <FavoriteBorderIcon className={styles.event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />;
        }
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.search}>
                    <div className={styles.search_row}>
                        <div className={styles.search_area}>
                            <input placeholder={'Find your next event'} className={styles.search_input} value={searchEventValue} onChange={e => { setSearchEventValue(e.currentTarget.value); }} />
                            <SearchIcon className={styles.search_icon} />
                        </div>
                        {/* <input className={styles.search_input_location} placeholder={'Location'} />
                        <Select
                            value={type}
                            onChange={onTypeChange}
                            className={styles.search_button_select}
                            inputProps={{ 'aria-label': 'Without label' }}
                            displayEmpty
                        >
                            <MenuItem value={'both'}>Online + In person</MenuItem>
                            <MenuItem value={'online'}>Online</MenuItem>
                            <MenuItem value={'inPerson'}>In person</MenuItem>
                        </Select>
                        <input type={'date'} className={styles.search_input_location} placeholder={'Date'} /> */}
                        <button className={styles.search_button} onClick={() => onSearchEvent(searchEventValue)}>Search</button>
                    </div>
                </div>
                <div className={styles.event}>
                    <div className={styles.line} />
                    {eventList?.map?.((item) => (
                        < EventItem item={item} onGetSharedLink={onGetSharedLink} renderInterestedIcon={renderInterestedIcon} key={item.id} />
                    ))}
                </div>
            </div>
        </>
    );
};

const EventItem = (props) => {
    const { item, onGetSharedLink, renderInterestedIcon } = props;
    const router = useRouter();
    const [img, setImg] = useState('');

    useEffect(() => {
        retrieveImagesCover();
    }, []);

    const retrieveImagesCover = async () => {
        if (item && item.cover_image && item.cover_image !== '' && item.img === '/calendar.svg') {
            const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_w3key });
            const res = await client.get(item.cover_image);
            if (res.ok) {
                const files = await res.files();
                for (const file of files) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        setImg(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    return (
        <div className={styles.event_item} key={item.id}>
            <div className={styles.event_item_header}>
                <img src={img || '/calendar.svg'} className={styles.event_item_img} alt="img" onClick={() => router.push(`/event/event-detail?id=${item.id}`)} />
            </div>
            <div className={styles.event_item_info}>
                <div className={styles.event_item_date}>{item.date}</div>
                <div className={styles.event_item_name} onClick={() => router.push(`/event/event-detail?id=${item.id}`)}>
                    {item.name}
                </div>
                <div className={styles.event_item_footer}>
                    <div className={styles.event_item_type}>{item.type}</div>

                    <div className={styles.event_item_attendees}>{item.attendees} attendees</div>
                    <ShareOutlinedIcon
                        className={styles.event_item_icon}
                        onClick={() => {
                            onGetSharedLink(item.id);
                        }}
                    />
                    {renderInterestedIcon(item)}
                </div>
            </div>
        </div>
    );
};

export default MoreEvent;
