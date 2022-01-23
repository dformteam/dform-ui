import React, { useEffect, useState } from 'react';
import styles from './Time.module.scss';
import Switch from '@mui/material/Switch';

const Time = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Type a question'],
        meta: [],
        isRequired: defaultValue?.isRequired,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }
    const [title, setTitle] = useState(initValue?.title?.[0] || 'Type a question');
    const [time, setTime] = useState('');
    const [required, setRequired] = React.useState(true);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        onChange?.({
            index,
            title: [e.target.value],
            meta: [],
            isRequired: defaultValue?.isRequired,
        });
    };

    const onTimeChange = (e) => {
        setTime(e.target.value);
        onChange?.();
        type === 'answer' &&
            onChange?.({
                index,
                title: [title],
                meta: [e.target.value],
                isRequired: defaultValue?.isRequired,
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

    const onChangeRequired = (event) => {
        setRequired(event.target.checked);
    };

    return (
        <div className={styles.root_time}>
            <div className={styles.time_content}>
                <input className={styles.time_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.time_description} placeholder={'Type a description'} />
                <div className={styles.timerequire}>
                    Question required: <Switch checked={required} onChange={onChangeRequired} />
                </div>
                <div className={styles.time}>
                    <div className={styles.time_form}>
                        <input className={styles.time_input} type={'time'} disabled={type === 'answer' ? false : true} value={time} onChange={onTimeChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Time;
