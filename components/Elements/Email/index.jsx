import React, { useState } from 'react';
import styles from './Email.module.scss';

const Email = ({ index, onChange, defaultValue, type = '' }) => {
    const initValue = {
        title: ['Email', 'We collect your email to bla bla bla...', 'Email.'],
        meta: [],
        isRequired: false,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Email');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'We collect your email to bla bla bla...');
    const [second_field, setSecondField] = useState(initValue?.title?.[2] || 'Email');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value, first_field, second_field],
                meta: [],
                isRequired: false,
            });
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, e.target.value, second_field],
                meta: [],
                isRequired: false,
            });
    };

    const onSecondFieldChange = (e) => {
        setSecondField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, first_field, e.target.value],
                meta: [],
                isRequired: false,
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
                    disabled={type === 'edit' ? false : true}
                />
                {(type === 'edit' || second_field !== '') && (
                    <input
                        className={styles.email_description}
                        value={first_field}
                        placeholder={'Type a description'}
                        onChange={onFirstFieldChange}
                        disabled={type === 'edit' ? false : true}
                    />
                )}
                <div className={styles.email}>
                    <div className={styles.email_form}>
                        <input
                            className={styles.email_label}
                            value={second_field}
                            onChange={onSecondFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'edit' ? false : true}
                        />
                        <input className={styles.email_input} type={'email'} placeholder={'example@example.com'} disabled={type === 'answer' ? false : true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Email;
