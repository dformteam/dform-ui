/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './Time.module.scss';
import Switch from '@mui/material/Switch';

const Time = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Type a question', 'Type your description'],
        meta: [],
        isRequired: false,
        error: '',
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }
    const [title, setTitle] = useState(initValue?.title?.[0] || 'Type a question');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'Type your description.');
    const [time, setTime] = useState('');
    const [required, setRequired] = useState(initValue.isRequired || false);
    const [error, setError] = useState(initValue.error);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value, first_field],
                meta: [],
                isRequired: required,
            });
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, e.target.value],
                meta: [],
                isRequired: required,
            });
    };

    const onTimeChange = (e) => {
        setTime(e.target.value);
        setError('');
        type === 'answer' &&
            onChange?.({
                index,
                title: [title, first_field],
                meta: [e.target.value],
                isRequired: required,
            });
    };

    const onFillValue = () => {
        if (type === 'analysis') {
            setTime(initValue?.meta?.[0] || '');
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
                title: [title],
                meta: [],
                isRequired: e.target.checked,
            });
    };

    return (
        <div className={styles.root_time}>
            <div className={styles.time_content}>
                <input
                    className={styles.time_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'answer' ? false : true}
                />
                <input
                    className={styles.time_description}
                    value={first_field}
                    onChange={onFirstFieldChange}
                    placeholder={'Type a description'}
                    disabled={type === 'answer' ? false : true}
                />
                {type !== 'answer' && (
                    <div className={styles.timerequire}>
                        Question required: <Switch value={required} checked={required} onChange={onChangeRequired} />
                    </div>
                )}
                <div className={styles.time}>
                    <div className={styles.time_form}>
                        <input className={styles.time_input} type={'time'} disabled={type === 'answer' ? false : true} value={time} onChange={onTimeChange} />
                    </div>
                </div>
                {error !== '' && <div className={styles.text_error}>Error</div>}
            </div>
        </div>
    );
};

export default Time;
