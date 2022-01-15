import React, { useState } from 'react';
import styles from './Email.module.scss';

const Email = ({ index, onChange, defaultValue, type = '' }) => {
    const initValue = {
        title: ['Email', 'Email.'],
        meta: [],
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Email');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'Email');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [e.target.value, first_field],
            });
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, e.target.value],
            });
    };

    return (
        <div className={styles.root_email}>
            <div className={styles.email_content}>
                <input
                    className={styles.email_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'create' ? false : true}
                />
                <input className={styles.email_description} placeholder={'Type a description'} disabled={type === 'create' ? false : true} />
                <div className={styles.email}>
                    <div className={styles.email_form}>
                        <input
                            className={styles.email_label}
                            value={first_field}
                            onChange={onFirstFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'create' ? false : true}
                        />
                        <input className={styles.email_input} type={'email'} placeholder={'example@example.com'} disabled={type === 'answer' ? false : true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Email;
