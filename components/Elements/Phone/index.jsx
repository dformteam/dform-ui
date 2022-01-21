import React, { useState } from 'react';
import styles from './Phone.module.scss';

const Phone = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Phone Number', 'Please enter a valid phone number.'],
        meta: [],
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Phone Number');
    const [first_field, setFirstField] = useState(initValue?.first_field?.[1] || 'Please enter a valid phone number.');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value, first_field],
                meta: [],
        isRequire: false,
    })
};

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, e.target.value],
                meta: [],
        isRequire: false,
    })
};

    return (
        <div className={styles.root_phone}>
            <div className={styles.phone_content}>
                <input className={styles.phone_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.phone_description} placeholder={'Type a description'} />
                <div className={styles.phone}>
                    <div className={styles.phone_form}>
                        <input className={styles.phone_label} value={first_field} onChange={onFirstFieldChange} placeholder={'Type a field'} />
                        <input className={styles.phone_input} type={'tel'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phone;
