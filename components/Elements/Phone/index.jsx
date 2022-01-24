/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './Phone.module.scss';
import Switch from '@mui/material/Switch';

const Phone = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Phone Number', 'Type your description', 'Please enter a valid phone number.'],
        meta: [],
        isRequired: false,
        error: '',
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Phone Number');
    const [first_field, setFirstField] = useState(initValue?.first_field?.[1] || 'Type your description');
    const [second_field, setSecondField] = useState(initValue?.first_field?.[1] || 'Please enter a valid phone number.');
    const [phone, setPhone] = useState('');
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
                title: [title, first_field, e.target.value],
                meta: [],
                isRequired: required,
            });
    };

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
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
        if (type === 'answer') {
            setPhone(initValue?.meta?.[0] || '');
        }
    };

    useEffect(() => {
        onFillValue();
    }, []);

    const onChangeRequired = (e) => {
        setRequired(e.target.checked);
        type !== 'edit' &&
            onChange?.({
                index,
                title: [title, first_field, second_field],
                meta: [],
                isRequired: e.target.checked,
            });
    };

    return (
        <div className={styles.root_phone}>
            <div className={styles.phone_content}>
                <input
                    className={styles.phone_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'edit' ? false : true}
                />
                <input
                    className={styles.phone_description}
                    value={first_field}
                    onChange={onFirstFieldChange}
                    placeholder={'Type a description'}
                    disabled={type === 'edit' ? false : true}
                />
                {type !== 'answer' && (
                    <div className={styles.phone_require}>
                        Question required: <Switch value={required} checked={required} onChange={onChangeRequired} />
                    </div>
                )}
                <div className={styles.phone}>
                    <div className={styles.phone_form}>
                        <input className={styles.phone_label} value={second_field} onChange={onSecondFieldChange} placeholder={'Type a field'} disabled={type === 'edit' ? false : true}/>
                        <input className={styles.phone_input} type={'tel'} value={phone} onChange={onPhoneChange} disabled={type === 'answer' ? false : true} />
                        {error !== '' && <div className={styles.text_error}>Error</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phone;
