import React, { useState } from 'react';
import styles from './Email.module.scss';

const Email = () => {
    const [title, setTitle] = useState('Email');
    const [first_field, setFirstField] = useState('Email');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
    };

    return (
        <div className={styles.root_email}>
            <div className={styles.email_content}>
                <input className={styles.email_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.email_description} placeholder={'Type a description'} />
                <div className={styles.email}>
                    <div className={styles.email_form}>
                        <input className={styles.email_label} value={first_field} onChange={onFirstFieldChange} placeholder={'Type a field'} />
                        <input className={styles.email_input} type={'email'} placeholder={'example@example.com'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Email;
