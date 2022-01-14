import React, { useState } from 'react';
import styles from './Phone.module.scss';

const Phone = () => {
    const [title, setTitle] = useState('Phone Number');
    const [first_field, setFirstField] = useState('Please enter a valid phone number.');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
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
