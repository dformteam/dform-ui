import React, { useState } from 'react';
import styles from './FullName.module.scss';

const FullName = ({ index, onChange, defaultValue, type = '' }) => {
    const initValue = {
        title: ['Name', 'First Name', 'Last Name'],
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Name');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'First Name');
    const [second_field, setSecondField] = useState(initValue?.title?.[2] || 'Last Name');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [e.target.value, first_field, second_field],
                meta: [],
        isRequire: false,
    })
};

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, e.target.value, second_field],
                meta: [],
        isRequire: false,
    })
};

    const onSecondFieldChange = (e) => {
        setSecondField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, first_field, e.target.value],
                meta: [],
        isRequire: false,
    })
};

    return (
        <div className={styles.root_full_name}>
            <div className={styles.full_name_content}>
                <input
                    className={styles.full_name_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'create' ? false : true}
                />
                <input className={styles.full_name_description} placeholder={'Type a description'} disabled={type === 'create' ? false : true} />
                <div className={styles.full_name}>
                    <div className={styles.full_name_form_left}>
                        <input
                            className={styles.full_name_label}
                            value={first_field}
                            onChange={onFirstFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'create' ? false : true}
                        />
                        <input className={styles.full_name_input} />
                    </div>
                    <div className={styles.full_name_form_right}>
                        <input
                            className={styles.full_name_label}
                            value={second_field}
                            onChange={onSecondFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'create' ? false : true}
                        />
                        <input className={styles.full_name_input} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullName;
