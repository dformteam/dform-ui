import { useState, useLayoutEffect } from 'react';
import styles from './Event.module.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/router';
import ModalShare from '../../components/Share';
import { useSelector } from 'react-redux';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: '#fff',
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    paddingTop: '20px',
};

const Event = () => {
    const router = useRouter();
    const [type, setType] = useState('both');
    const [modalShare, setModalShare] = useState(false);
    const [searchEventValue, setSearchEventValue] = useState('');
    const [eventList, setEventList] = useState([]);
    const [nextEvent, setNextEvent] = useState({});

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

    useLayoutEffect(() => {
        onGetMaxRows();
    }, []);

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
                                    attendees: event.participants.length
                                }
                                aEvents.push(eventInfo);
                                let tmp_dt = current_timestamp - event.start_date;
                                if (dt == -1) {
                                    dt = tmp_dt;
                                    current_event = event;
                                } else if (tmp_dt < dt) {
                                    dt = tmp_dt;
                                    current_event = event;
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

    const renderEventItem = (item) => {
        return (
            <div className={styles.event_item} key={item.id}>
                <div className={styles.event_item_header}>
                    <div className={styles.event_item_type}>{item.type}</div>
                    <img src={'/calendar.svg'} className={styles.event_item_img} alt="img" />
                </div>
                <div className={styles.event_item_info}>
                    <div className={styles.event_item_date}>{item.date}</div>
                    <div className={styles.event_item_name}>{item.name}</div>
                    <div className={styles.event_item_footer}>
                        <div className={styles.event_item_attendees}>{item.attendees} attendees</div>
                        <ShareOutlinedIcon className={styles.event_item_icon} onClick={() => setModalShare(true)} />
                        <FavoriteBorderIcon className={styles.event_item_icon_favor} />
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

    return (
        <div className={styles.root}>
            <div className={styles.label_create}>Start to create your event</div>
            <button className={styles.button_create} onClick={onCreateEvent}>
                Create Event
            </button>
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
                    <img src={'/calendar.svg'} className={styles.attend_item_img} alt="img" />
                </div>
                <div className={styles.attend_item_info} onClick={() => router.push(`/event/event-detail?id=${nextEvent.id}`)}>
                    {/* <div className={styles.attend_item_date}>{'Sat, Jan 15 @ 5:30 PM'}</div> */}
                    {/* <div className={styles.attend_item_name}>{'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club'}</div> */}
                    <div className={styles.attend_item_date}>{nextEvent.start_date}</div>
                    <div className={styles.attend_item_name}>{nextEvent.name}</div>
                </div>
                <div className={styles.attend_item_footer}>
                    <div className={styles.attending}>
                        <CheckCircleIcon className={styles.attending_icon} />
                        Attending
                    </div>
                    <ShareOutlinedIcon className={styles.attend_item_icon} />
                </div>
            </div>
            <div className={styles.label}>
                <div className={styles.label_title}>Find your next event</div>
            </div>
            <div className={styles.search_row}>
                <div className={styles.search_area}>
                    <input placeholder={'Find your next event'} className={styles.input_search} value={searchEventValue} onChange={e => { setSearchEventValue(e.currentTarget.value); }} />
                    <SearchIcon className={styles.search_icon} />
                </div>
                <input className={styles.input_location} placeholder={'Location'} />
                <Select value={type} onChange={onTypeChange} className={styles.button_select} inputProps={{ 'aria-label': 'Without label' }} displayEmpty>
                    <MenuItem value={'both'}>Online + In person</MenuItem>
                    <MenuItem value={'online'}>Online</MenuItem>
                    <MenuItem value={'inPerson'}>In person</MenuItem>
                </Select>
                <input type={'date'} className={styles.input_location} placeholder={'Date'} />
                <button className={styles.button_search} onClick={() => onSearchEvent(searchEventValue)}>Search</button>
            </div>
            <div className={styles.label}>
                <div className={styles.label_title}>Attend an event</div>
                <div className={styles.label_text} onClick={() => router.push('/event/more-events')}>
                    More events <ChevronRightOutlinedIcon className={styles.icon_collapse} />
                </div>
            </div>
            <div className={styles.line} />
            <div className={styles.list_event}>{eventList.map((item) => renderEventItem(item))}</div>

            <Modal open={modalShare} onClose={onCloseModalShare} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={'center'}>
                        Share this event
                    </Typography>
                    <div className={styles.line_gradient}></div>
                    <ModalShare />
                </Box>
            </Modal>
        </div>
    );
};

export default Event;
