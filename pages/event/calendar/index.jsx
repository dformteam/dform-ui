import { useEffect, useState } from 'react';
import styles from './Calendar.module.scss';
import Kalend, { CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css';
import { useRouter } from 'next/router';

const Calendar = (props) => {
    const router = useRouter();
    const [demoEvents, setDemoEvents] = useState(events);

    const onNewEventClick = (data) => {
        const msg = `New event click action\n\n Callback data:\n\n${JSON.stringify({
            hour: data.hour,
            day: data.day,
            event: 'click event ',
        })}`;
        console.log(msg);
    };

    const onEventClick = (data) => {
        const msg = `Click on event action\n\n Callback data:\n\n${JSON.stringify(data)}`;
        console.log(msg);
    };

    const onEventDragFinish = (prev, current, data) => {
        setDemoEvents(data);
    };

    const onCreateEventClick = () => {
        router.push('/event/create-event');
    };

    return (
        <div className={styles.root}>
            <div className={styles.button_area}>
                <button className={styles.button_area_button} onClick={onCreateEventClick}>
                    Create Event
                </button>
            </div>
            <Kalend
                kalendRef={props.kalendRef}
                onNewEventClick={onNewEventClick}
                initialView={CalendarView.WEEK}
                disabledViews={[]}
                onEventClick={onEventClick}
                events={demoEvents}
                initialDate={new Date().toISOString()}
                hourHeight={60}
                timezone={'Europe/Berlin'}
                onEventDragFinish={onEventDragFinish}
                onStateChange={props.onStateChange}
                selectedView={props.selectedView}
            />
        </div>
    );
};

export default Calendar;

const events = [
    {
        id: 1,
        startAt: '2021-11-21T18:00:00.000Z',
        endAt: '2021-11-21T19:00:00.000Z',
        timezoneStartAt: 'Europe/Berlin',
        summary: 'test',
        color: 'blue',
        calendarID: 'work',
    },
    {
        id: 2,
        startAt: '2021-11-21T18:00:00.000Z',
        endAt: '2021-11-21T19:00:00.000Z',
        timezoneStartAt: 'Europe/Berlin',
        summary: 'test',
        color: 'blue',
    },
];
