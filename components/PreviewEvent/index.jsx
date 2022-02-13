import React, { useState } from 'react';
import styles from './PreviewEvent.module.scss';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';

const PreviewEvent = () => {
    const [attendees, setAttend] = useState([
        { id: '1', wallet: 'anhhd.near' },
        { id: '2', wallet: 'niutomnm.near' },
    ]);

    return (
        <div className={styles.root}>
            <div className={styles.content}>
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
                <div className={styles.content_detail}>
                    <div className={styles.content_detail_row}>
                        <div className={styles.content_detail_cover}>
                            <img src={'/calendar.svg'} alt="cover" className={styles.content_detail_cover_img} />
                        </div>
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
                    <div className={styles.content_detail_label}>Attendees ({attendees?.length || 0})</div>
                    <div className={styles.content_detail_list}>
                        {attendees?.map?.((item) => {
                            return (
                                <div className={styles.content_detail_list_wallet} key={item.id}>
                                    {item.wallet}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewEvent;
