import React, { useState, useEffect } from 'react';
import styles from './Event.module.scss';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Web3Storage } from 'web3.storage';

export default function EventCalendar() {
    const [date, setValue] = React.useState(new Date());
    const [eventList, setEventList] = useState([]);

    return (
        <div className={styles.root}>
            <div className={styles.left_menu}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDatePicker
                        className={styles.left_menu_picker}
                        displayStaticWrapperAs="desktop"
                        openTo="day"
                        date={date}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </div>
            <div className={styles.content}>
                <div className={styles.content_title}>Your Event</div>
                <div className={styles.content_today}>
                    Today, {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getDate()}, {new Date().getFullYear()}
                </div>
                <div className={styles.line} />
                <div className={styles.content_event}>
                    {eventList?.length > 0 ? (
                        <>
                            {eventList?.map?.((item, index) => {
                                if (item && item.id) {
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
                                return null;
                            })}
                        </>
                    ) : (
                        <div className={styles.content_event_nothing}>Nothing to display</div>
                    )}
                </div>
            </div>
        </div>
    );
}

const EventItem = (props) => {
    const { item, label, activeTab } = props;
    const [img, setImg] = useState('/calendar.svg');

    useEffect(() => {
        retrieveImagesCover();
    }, []);

    const retrieveImagesCover = async () => {
        if (item && item.cover_image && item.cover_image !== '' && item.img === '/calendar.svg') {
            const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_w3key });
            const res = await client?.get?.(item.cover_image);
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
        <div className={styles.content_event_item}>
            <img src={img} className={styles.content_event_item_img} alt="img" />
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
                <ShareOutlinedIcon className={styles.content_event_item_icon} onClick={() => props.onGetSharedLink(item.id, item.name)} />
                {/* <FavoriteBorderIcon className={styles.content_event_item_icon_favor} onClick={() => onEventFavoriteClick(item.id)} /> */}
                {props?.renderInterestedIcon?.(item)}
            </div>
        </div>
    );
};
