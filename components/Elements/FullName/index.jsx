/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './FullName.module.scss';

const FullName = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Name', 'First Name', 'Last Name'],
        meta: [],
        isRequired: defaultValue?.isRequired,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Name');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'First Name');
    const [second_field, setSecondField] = useState(initValue?.title?.[2] || 'Last Name');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value, first_field, second_field],
                meta: [],
                isRequired: defaultValue?.isRequired,
            });
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, e.target.value, second_field],
                meta: [],
                isRequired: defaultValue?.isRequired,
            });
    };

    const onSecondFieldChange = (e) => {
        setSecondField(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title, first_field, e.target.value],
                meta: [],
                isRequired: defaultValue?.isRequired,
            });
    };

    const onFirsNameChange = (e) => {
        setFirstName(e.target.value);
        type === 'answer' &&
            onChange?.({
                index,
                title: [title, first_field, second_field],
                meta: [e.target.value, last_name],
                isRequired: defaultValue?.isRequired,
            });
    };

    const onLastNameChange = (e) => {
        setLastName(e.target.value);
        type === 'answer' &&
            onChange?.({
                index,
                title: [title, first_field, second_field],
                meta: [first_name, e.target.value],
                isRequired: defaultValue?.isRequired,
            });
    };

    const onFillValue = () => {
        if (type === 'answer') {
            setFirstName(initValue?.meta?.[0] || '');
            setLastName(initValue?.meta?.[0] || '');
        }
    };

    useEffect(() => {
        onFillValue();
    }, []);

    return (
        <div className={styles.root_full_name}>
            <div className={styles.full_name_content}>
                <input
                    className={styles.full_name_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'edit' ? false : true}
                />
                <input className={styles.full_name_description} placeholder={'Type a description'} disabled={type === 'edit' ? false : true} />
                <div className={styles.full_name}>
                    <div className={styles.full_name_form_left}>
                        <input
                            className={styles.full_name_label}
                            value={first_field}
                            onChange={onFirstFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'edit' ? false : true}
                        />
                        <input className={styles.full_name_input} disabled={type === 'answer' ? false : true} value={first_name} onChange={onFirsNameChange} />
                    </div>
                    <div className={styles.full_name_form_right}>
                        <input
                            className={styles.full_name_label}
                            value={second_field}
                            onChange={onSecondFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'edit' ? false : true}
                        />
                        <input className={styles.full_name_input} disabled={type === 'answer' ? false : true} value={last_name} onChange={onLastNameChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullName;
