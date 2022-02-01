import { useEffect, useState } from 'react';
import styles from './Calendar.module.scss';
import Kalend, { CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css';

const Calendar = (props) => {
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

    return (
        <div className={styles.root}>
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
