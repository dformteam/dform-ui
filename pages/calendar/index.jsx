import { useEffect, useLayoutEffect, useState } from 'react';
import styles from './Calendar.module.scss';
import Kalend, { CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import EventCalendar from './event';

const Calendar = (props) => {
    const events = [];
    const router = useRouter();
    const colorList = ['red', 'blue', 'orange', 'green', 'violet'];
    const [demoEvents, setDemoEvents] = useState(events);
    const wallet = useSelector((state) => state.wallet);

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

    const onGetRows = async ({ total }) => {
        const { contract, walletConnection } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        const accountId = walletConnection.getAccountId();
        let userId = walletConnection.getAccountId();
        if (router.query.id) {
            userId = router.query.id;
        }
        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_events({
                        userId,
                        page: index + 1,
                    })
                    .then((data) => {
                        if (data) {
                            data.data.map((event) => {
                                if (event?.is_published) {
                                    let eventInfo = {
                                        id: event.id,
                                        startAt: new Date(parseFloat(event.start_date)).toISOString(),
                                        endAt: new Date(parseFloat(event.end_date)).toISOString(),
                                        summary: userId === accountId ? event.name : 'Busy',
                                        color: userId === accountId ? colorList[Math.floor(Math.random() * colorList.length)] : 'orange',
                                    };
                                    events.push(eventInfo);
                                }
                            });
                            setDemoEvents([...events]);
                        }
                    });
            }),
        );
    };

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
        router.push(`/event/event-detail?id=${data.id}`)
    };

    const onEventDragFinish = (prev, current, data) => {
        setDemoEvents(data);
    };

    const onCreateEventClick = () => {
        router.push('/event/create-event');
    };

    const generateMessage = () => {
        let message = 'This NEAR Account not available';
        if (demoEvents !== [] && router.query.id) {
            message = `You are watching ${router.query.id}'s timeline`;
        } else {
            return null;
        }
        return <div className={styles.label_title}><br />{message}</div>;
    }

    return (
        <div className={styles.root}>
            {generateMessage()}
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
                // timezone={'Europe/Berlin'}
                onEventDragFinish={onEventDragFinish}
                onStateChange={props.onStateChange}
                selectedView={props.selectedView}
            />
            <EventCalendar />
        </div>
    );
};

export default Calendar;
