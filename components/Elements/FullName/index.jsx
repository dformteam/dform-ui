import React, { useState } from 'react';
import styles from './FullName.module.scss';

const FullName = () => {
    const [title, setTitle] = useState('Name');
    const [first_field, setFirstField] = useState('First Name');
    const [second_field, setSecondField] = useState('Last Name');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
    };

    const onSecondFieldChange = (e) => {
        setSecondField(e.target.value);
    };

    return (
        <div className={styles.root_full_name}>
            <div className={styles.full_name_content}>
                <input className={styles.full_name_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.full_name_description} placeholder={'Type a description'} />
                <div className={styles.full_name}>
                    <div className={styles.full_name_form_left}>
                        <input className={styles.full_name_label} value={first_field} onChange={onFirstFieldChange} placeholder={'Type a field'} />
                        <input className={styles.full_name_input} />
                    </div>
                    <div className={styles.full_name_form_right}>
                        <input className={styles.full_name_label} value={second_field} onChange={onSecondFieldChange} placeholder={'Type a field'} />
                        <input className={styles.full_name_input} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullName;
