import React, { useState } from 'react';
import styles from './EventDetail.module.scss';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const EventDetail = (props) => {
    const [attendees, setAttend] = useState([
        { id: '1', wallet: 'anhhd.near' },
        { id: '2', wallet: 'niutomnm.near' },
    ]);
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
            <div className={styles.content}>
                <div className={styles.content_event}>
                    <div className={styles.content_info}>
                        <div className={styles.content_info_date}>Saturday, January 15, 2022</div>
                        <div className={styles.content_info_name}>Event's Name</div>
                        <div className={styles.content_info_row}>
                            <img src={'/calendar.svg'} className={styles.content_info_row_icon} />
                            <div className={styles.content_info_row_info}>
                                <div className={styles.content_info_row_info_host}>Hosted By</div>
                                <div className={styles.content_info_row_info_wallet}>Owner.near</div>
                            </div>
                        </div>
                    </div>
                    <div>Free</div>
                    <div className={styles.content_action}>
                        <ShareOutlinedIcon className={styles.content_action_icon} />
                        <FavoriteBorderIcon className={styles.content_action_icon_favor} />
                    </div>
                    <button className={styles.content_button_attend}>Attend</button>
                </div>
                <div className={styles.content_detail}>
                    <div className={styles.content_detail_row}>
                        <div className={styles.content_detail_cover}>Cover</div>
                        <div className={styles.content_detail_info}>
                            <div className={styles.content_detail_info_row}>
                                <AccessAlarmOutlinedIcon className={styles.content_detail_info_icon} />
                                <div className={styles.content_detail_info_column}>
                                    <div className={styles.content_detail_info_date}>Saturday, January 15, 2022</div>
                                    <div className={styles.content_detail_info_date}>5:30 PM to 7:00 PM</div>
                                    <div className={styles.content_detail_info_add}>Add to calendar</div>
                                </div>
                            </div>
                            <div className={styles.content_detail_info_row}>
                                <AttachFileOutlinedIcon className={styles.content_detail_info_icon} />
                                <div className={styles.content_detail_info_column}>
                                    <div className={styles.content_detail_info_date}>Online event</div>
                                    <div className={styles.content_detail_info_link}>https://vnexpress.net/</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.content_detail_label}>Details</div>
                    <div className={styles.content_detail_text}>
                        Huddle up and bring together ideas to help each other succeed. A monthly open house session where marketers of all shades and hue, from
                        different walks of business come together to help each other out.
                        <br />
                        <br /> Have a specific query on strategy, tactics, platforms, need an honest peer review of your idea or any other marketing question
                        under the sun, bring it on and have some of the brightest minds in marketing help you solve it. .
                    </div>
                    <div className={styles.content_detail_row_space}>
                        <div className={styles.content_detail_label}>Attendees ({attendees?.length || 0})</div>
                        <div className={styles.content_detail_see_all}>See all</div>
                    </div>
                    <div className={styles.content_detail_list}>
                        {attendees?.map?.((item) => {
                            return (
                                <div className={styles.content_detail_list_wallet} key={item.id}>
                                    {item.wallet}
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.content_detail_row_space}>
                        <div className={styles.content_detail_label}>Similar Events</div>
                        <div className={styles.content_detail_see_all}>See all</div>
                    </div>
                    <div className={styles.content_detail_list}>
                        {aEvents.map((item, index) => {
                            return (
                                <div className={styles.content_detail_list_item} key={index}>
                                    <div className={styles.content_detail_list_name}>
                                        <div className={styles.content_detail_list_name_text}>{item.name}</div>
                                    </div>
                                    <button className={styles.content_detail_list_attend}>Attend</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
