import React, { useState } from 'react';
import styles from './DatePicker.module.scss';

const DatePicker = () => {
    const [title, setTitle] = useState('Date Picker');
    const [first_field, setFirstField] = useState('Please pick a date.');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
    };

    return (
        <div className={styles.root_date_picker}>
            <div className={styles.date_picker_content}>
                <input className={styles.date_picker_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.date_picker_description} placeholder={'Type a description'} />
                <div className={styles.date_picker}>
                    <div className={styles.date_picker_form}>
                        <input className={styles.date_picker_label} value={first_field} onChange={onFirstFieldChange} placeholder={'Type a field'} />
                        <input className={styles.date_picker_input} type={'date'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
