import React, { useState } from 'react';
import styles from './Time.module.scss';

const Time = () => {
    const [title, setTitle] = useState('Type a question');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    return (
        <div className={styles.root_time}>
            <div className={styles.time_content}>
                <input className={styles.time_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.time_description} placeholder={'Type a description'} />
                <div className={styles.time}>
                    <div className={styles.time_form}>
                        <input className={styles.time_input} type={'time'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Time;
