import { useState, useRef, Fragment } from 'react';
import styles from './CreateEvent.module.scss';

const CreateEvent = () => {
    const [event_name, setEventName] = useState('');
    const [imgSelected, setImgSelected] = useState();
    const fileInput = useRef(null);

    const eventType = [
        { id: 'online', label: 'Online' },
        { id: 'in_person', label: 'In Person' },
        { id: 'both', label: 'Online + In Person' },
    ];

    const onChangeEventName = (e) => {
        setEventName(e.target.value);
    };

    const onChangeCover = (e) => {
        const files = e.target.files;
        const filesArr = Array.prototype.slice.call(files);
        setImgSelected(fileInput.current.files[0]?.name);
    };

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.content_title}>Create Event</div>
                <div className={styles.content_label}>Event's name</div>
                <input className={styles.content_input} placeholder="Enter event name" value={event_name} onChange={onChangeEventName} />
                <div className={styles.content_label}>Date</div>
                <input type={'datetime-local'} className={styles.content_input} />
                <div className={styles.content_label}>Details</div>
                <textarea className={styles.content_detail} rows={5} />
                <div className={styles.content_label}>Image Cover</div>
                <input className={styles.content_input_file} type={'file'} id={'create_event_file'} ref={fileInput} onChange={onChangeCover} />
                <label htmlFor={'create_event_file'}>{imgSelected ? imgSelected : 'Choose a file...'}</label>
                <div className={styles.content_label}>Event Type</div>
                <div className={styles.content_row}>
                    {eventType?.map?.((item) => {
                        return (
                            <Fragment key={item.id}>
                                <input type="radio" id={item.id} name="event_type" value={item.id} />
                                <label htmlFor={item.id} className={styles.content_row_label}>
                                    {item.label}
                                </label>
                            </Fragment>
                        );
                    })}
                </div>
                <button className={styles.content_attend_button}>Attend</button>
            </div>
        </div>
    );
};

export default CreateEvent;
