import { useState } from 'react';
import styles from './MyEvent.module.scss';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const MyEvent = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
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

    return (
        <div className={styles.root}>
            <div className={styles.left_menu}>
                <div className={styles.left_menu_row}>
                    <button
                        className={activeTab === 'upcoming' ? styles.left_menu_button_active : styles.left_menu_button}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button className={activeTab === 'past' ? styles.left_menu_button_active : styles.left_menu_button} onClick={() => setActiveTab('past')}>
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
                        <div className={styles.left_menu_content_text}>You're attend 2 events in the past</div>
                    )}
                    <div className={styles.left_menu_content_link}>Go to calendar</div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.content_title}>Your Event</div>
                <div className={styles.content_today}>Today, January 17, 2022</div>
                <div className={styles.line} />
                <div className={styles.content_event}>
                    {aEvents?.map?.((item) => {
                        return (
                            <div className={styles.content_event_item} key={item.id}>
                                <img src={'/calendar.svg'} className={styles.content_event_item_img} alt="img" />
                                <div className={styles.content_event_item_info}>
                                    <div className={styles.content_event_item_date}>{item.date}</div>
                                    <div className={styles.content_event_item_name}>{item.name}</div>
                                    <div className={styles.content_event_item_attendees}>{item.attendees} attendees</div>
                                    <div className={styles.content_event_item_attending}>
                                        <CheckCircleOutlineOutlinedIcon />
                                        Attending
                                    </div>
                                </div>
                                <div className={styles.content_event_item_share}>
                                    <ShareOutlinedIcon className={styles.content_event_item_icon} />
                                    <FavoriteBorderIcon className={styles.content_event_item_icon_favor} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MyEvent;
