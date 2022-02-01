import { useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './CreateEvent.module.scss';

const CreateEvent = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const [event_name, setEventName] = useState('');
    const [event_description, setEventDescription] = useState('');
    const [imgSelected, setImgSelected] = useState();
    const [event_type, setEventType] = useState(0);
    const fileInput = useRef(null);

    const onChangeEventName = (e) => {
        setEventName(e.target.value);
    };

    const onChangeCover = (e) => {
        const files = e.target.files?.[0];
        console.log(files);
        // const filesArr = Array.prototype.slice.call(files);
        setImgSelected(fileInput.current.files[0]?.name);
    };

    const onAttendEventClick = () => {
        const { contract } = wallet;

        contract
            ?.init_new_event?.(
                {
                    title: event_name,
                    description: [event_description],
                    location: 'Hanoi',
                    privacy: [],
                    cover_image: imgSelected,
                    type: event_type,
                },
                100000000000000,
            )
            .then((res) => {
                if (res) {
                    router.push(`/form/edit-form?id=${res}`);
                } else {
                    onShowResult({
                        type: 'error',
                        msg: 'Creat form failure',
                    });
                }
            })
            .catch((err) => {
                onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    const onChangeEventDescription = (e) => {
        setEventDescription(e.target.value);
    };

    const onEventTypeChange = (e) => {
        setEventType(e.target.value);
    };

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.content_title}>Create Event</div>
                <div className={styles.content_label}>Event's name</div>
                <input className={styles.content_input} placeholder="Enter event name" value={event_name} onChange={onChangeEventName} />
                <div className={styles.content_label}>Details</div>
                <textarea className={styles.content_detail} rows={5} value={event_description} onChange={onChangeEventDescription} />
                <div className={styles.content_label}>Image Cover</div>
                <input className={styles.content_input_file} type={'file'} id={'create_event_file'} ref={fileInput} onChange={onChangeCover} />
                <label htmlFor={'create_event_file'}>{imgSelected ? imgSelected : 'Choose a file...'}</label>
                <div className={styles.content_label}>Event Type</div>
                <div className={styles.content_row}>
                    {eventType?.map?.((item) => {
                        return (
                            <Fragment key={item.id}>
                                <input type="radio" id={item.id} name="event_type" value={item.typeId} onChange={onEventTypeChange} />
                                <label htmlFor={item.id} className={styles.content_row_label}>
                                    {item.label}
                                </label>
                            </Fragment>
                        );
                    })}
                </div>
                <button className={styles.content_attend_button} onClick={onAttendEventClick}>
                    Attend
                </button>
            </div>
        </div>
    );
};

export default CreateEvent;

const eventType = [
    { id: 'online', typeId: 0, label: 'Online' },
    { id: 'in_person', typeId: 1, label: 'In Person' },
    { id: 'both', typeId: 2, label: 'Online + In Person' },
];
