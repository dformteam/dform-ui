import { useState } from 'react';
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
    const aEvents = [
        {
            id: 1,
            name: 'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club',
            type: 'Online',
            date: 'Sat, Jan 15 @ 5:30 PM',
            attendees: 16,
        },
        { id: 2, name: '© 2021 Learn NEAR Club', type: 'Online + In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 66 },
        { id: 3, name: 'Event 3', type: 'In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
        { id: 4, name: 'Event 4', type: 'Online', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
    ];

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

    return (
        <div className={styles.root}>
            <div className={styles.label_create}>Start to create your event</div>
            <button className={styles.button_create} onClick={onCreateEvent}>
                Create Event
            </button>
            <div className={styles.label}>
                <div className={styles.label_title}>Your next event</div>
                <div className={styles.label_text}>
                    More events you're attending <ChevronRightOutlinedIcon className={styles.icon_collapse} />
                </div>
            </div>
            <div className={styles.line} />
            <div className={styles.attend_event}>
                <div className={styles.attend_item_header}>
                    <div className={styles.attend_item_type}>{'Online'}</div>
                    <img src={'/calendar.svg'} className={styles.attend_item_img} alt="img" />
                </div>
                <div className={styles.attend_item_info}>
                    <div className={styles.attend_item_date}>{'Sat, Jan 15 @ 5:30 PM'}</div>
                    <div className={styles.attend_item_name}>{'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club'}</div>
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
                    <input placeholder={'Find your next event'} className={styles.input_search} />
                    <SearchIcon className={styles.search_icon} />
                </div>
                <input className={styles.input_location} placeholder={'Location'} />
                <Select value={type} onChange={onTypeChange} className={styles.button_select} inputProps={{ 'aria-label': 'Without label' }} displayEmpty>
                    <MenuItem value={'both'}>Online + In person</MenuItem>
                    <MenuItem value={'online'}>Online</MenuItem>
                    <MenuItem value={'inPerson'}>In person</MenuItem>
                </Select>
                <input type={'date'} className={styles.input_location} placeholder={'Date'} />
                <button className={styles.button_search}>Search</button>
            </div>
            <div className={styles.label}>
                <div className={styles.label_title}>Attend an event</div>
                <div className={styles.label_text} onClick={() => router.push('/event/more-events')}>
                    More events <ChevronRightOutlinedIcon className={styles.icon_collapse} />
                </div>
            </div>
            <div className={styles.line} />
            <div className={styles.list_event}>{aEvents.map((item) => renderEventItem(item))}</div>

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
