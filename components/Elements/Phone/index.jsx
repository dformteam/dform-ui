/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './Phone.module.scss';
import Switch from '@mui/material/Switch';

const Phone = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Phone Number', 'Please enter a valid phone number.'],
        meta: [],
        isRequired: false,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Phone Number');
    const [first_field, setFirstField] = useState(initValue?.first_field?.[1] || 'Please enter a valid phone number.');
    const [phone, setPhone] = useState('');
    const [required, setRequired] = useState(initValue.isRequired || false);

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

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
        type === 'answer' &&
            onChange?.({
                index,
                title: [title, first_field],
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
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, first_field],
                meta: [],
                isRequired: e.target.checked,
            });
    };

    return (
        <div className={styles.root_phone}>
            <div className={styles.phone_content}>
                <input className={styles.phone_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.phone_description} placeholder={'Type a description'} />
                {type === 'edit' && (
                    <div className={styles.phone_require}>
                        Question required: <Switch checked={required} onChange={onChangeRequired} />
                    </div>
                )}
                <div className={styles.phone}>
                    <div className={styles.phone_form}>
                        <input className={styles.phone_label} value={first_field} onChange={onFirstFieldChange} placeholder={'Type a field'} />
                        <input className={styles.phone_input} type={'tel'} value={phone} onChange={onPhoneChange} disabled={type === 'answer' ? false : true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phone;
