import React, { useState } from 'react';
import styles from './DatePicker.module.scss';

const DatePicker = ({ index, onChange, defaultValue, type = '' }) => {
    const initValue = {
        title: ['Date Picker', 'Please pick a date.'],
        meta: [],
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Date Picker');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'Please pick a date.');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [e.target.value, first_field],
                meta: [],
        isRequire: false,
    })
};

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, e.target.value],
                meta: [],
        isRequire: false,
    })
};

    return (
        <div className={styles.root_date_picker}>
            <div className={styles.date_picker_content}>
                <input
                    className={styles.date_picker_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'create' ? false : true}
                />
                <input className={styles.date_picker_description} placeholder={'Type a description'} disabled={type === 'create' ? false : true} />
                <div className={styles.date_picker}>
                    <div className={styles.date_picker_form}>
                        <input
                            className={styles.date_picker_label}
                            value={first_field}
                            onChange={onFirstFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'create' ? false : true}
                        />
                        <input className={styles.date_picker_input} type={'date'} disabled={type === 'answer' ? false : true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
