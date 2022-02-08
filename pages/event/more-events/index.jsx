import { useState } from 'react';
import styles from './MoreEvent.module.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const MoreEvent = () => {
    const [type, setType] = useState('both');
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

    return (
        <div className={styles.root}>
            <div className={styles.search}>
                <div className={styles.search_row}>
                    <div className={styles.search_area}>
                        <input placeholder={'Find your next event'} className={styles.search_input} />
                        <SearchIcon className={styles.search_icon} />
                    </div>
                    <input className={styles.search_input_location} placeholder={'Location'} />
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
                    <input type={'date'} className={styles.search_input_location} placeholder={'Date'} />
                    <button className={styles.search_button}>Search</button>
                </div>
            </div>
            <div className={styles.event}>
                <div className={styles.line} />
                {aEvents?.map?.((item) => {
                    return (
                        <div className={styles.event_item} key={item.id}>
                            <img src={'/calendar.svg'} className={styles.event_item_img} alt="img" />
                            <div className={styles.event_item_info}>
                                <div className={styles.event_item_date}>{item.date}</div>
                                <div className={styles.event_item_name}>{item.name}</div>
                                <div className={styles.event_item_attendees}>{item.attendees} attendees</div>
                            </div>
                            <div className={styles.event_item_share}>
                                <ShareOutlinedIcon className={styles.event_item_icon} />
                                <FavoriteBorderIcon className={styles.event_item_icon_favor} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MoreEvent;
