/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './DatePicker.module.scss';
import Switch from '@mui/material/Switch';

const DatePicker = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Date Picker', 'Type your description', 'Please pick a date.'],
        meta: [],
        isRequired: false,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Date Picker');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'Type your description');
    const [second_field, setSecondField] = useState(initValue?.title?.[2] || 'Please pick a date.');
    const [date, setDate] = useState('');
    const [required, setRequired] = useState(initValue.isRequired || false);
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
                title: [title, first_field, second_field],
                meta: [],
                isRequired: required,
            });
    };

    const onDateChange = (e) => {
        setDate(e.target.value);
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
            setDate(initValue?.meta?.[0] || '');
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
                title: [title, first_field],
                meta: [],
                isRequired: e.target.checked,
            });
    };

    return (
        <div className={styles.root_date_picker}>
            <div className={styles.date_picker_content}>
                <input
                    className={styles.date_picker_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'edit' ? false : true}
                />
                <input
                    className={styles.date_picker_description}
                    value={first_field}
                    placeholder={'Type a description'}
                    onChange={onFirstFieldChange}
                    disabled={type === 'edit' ? false : true}
                />
                {type !== 'answer' && (
                    <div className={styles.date_picker_require}>
                        Question required: <Switch value={required} checked={required} onChange={onChangeRequired} />
                    </div>
                )}
                <div className={styles.date_picker}>
                    <div className={styles.date_picker_form}>
                        <input
                            className={styles.date_picker_label}
                            value={second_field}
                            onChange={onSecondFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'edit' ? false : true}
                        />
                        <input
                            className={styles.date_picker_input}
                            type={'date'}
                            disabled={type === 'answer' ? false : true}
                            value={date}
                            onChange={onDateChange}
                        />
                        {error !== '' && <div className={styles.text_error}>Error</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
