/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './Email.module.scss';
import Switch from '@mui/material/Switch';

const Email = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Email', 'Type your description.', 'Email.'],
        meta: [],
        isRequired: false,
        error: '',
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Email');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'Type your description.');
    const [second_field, setSecondField] = useState(initValue?.title?.[2] || 'Email');
    const [email, setEmail] = useState('');
    const [required, setRequired] = useState(initValue?.isRequired || false);
    const [error, setError] = useState(initValue.error);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value, first_field, second_field],
                meta: [],
                isRequired: required,
            });
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, e.target.value, second_field],
                meta: [],
                isRequired: required,
            });
    };

    const onSecondFieldChange = (e) => {
        setSecondField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, first_field, e.target.value],
                meta: [],
                isRequired: required,
            });
    };

    const onEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
        type === 'answer' &&
            onChange?.({
                index,
                title: [title, first_field, second_field],
                meta: [e.target.value],
                isRequired: required,
            });
    };

    const onFillValue = () => {
        if (type === 'analysis') {
            setEmail(initValue?.meta?.[0] || '');
            setRequired(initValue?.required);
        }
    };

    useEffect(() => {
        onFillValue();
    }, []);

    const onChangeRequired = (e) => {
        setRequired(e.target.checked);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, first_field, second_field],
                meta: [],
                isRequired: e.target.checked,
            });
    };

    return (
        <div className={styles.root_email}>
            <div className={styles.email_content}>
                {type === 'edit' ? (
                    <input className={styles.email_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                ) : (
                    <div className={styles.email_title}>
                        {title} {required && <span>*</span>}
                    </div>
                )}
                {(type === 'edit' || second_field !== '') && (
                    <input
                        className={styles.email_description}
                        value={first_field}
                        placeholder={'Type a description'}
                        onChange={onFirstFieldChange}
                        disabled={type === 'edit' ? false : true}
                    />
                )}
                {type !== 'answer' && (
                    <div className={styles.email_require}>
                        Question required: <Switch value={required} checked={required} onChange={onChangeRequired} />
                    </div>
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
                        <input
                            className={styles.email_input}
                            type={'email'}
                            placeholder={'example@example.com'}
                            disabled={type === 'answer' ? false : true}
                            value={email}
                            onChange={onEmailChange}
                        />
                        {error !== '' && <div className={styles.text_error}>Error</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Email;
