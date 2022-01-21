import React, { useState } from 'react';
import styles from './LongText.module.scss';

const LongText = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Type a question'],
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Type a question');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value],
                meta: [],
        isRequire: false,
    })
};

    return (
        <div className={styles.root_long_text}>
            <div className={styles.long_text_content}>
                <input
                    className={styles.long_text_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'edit' ? false : true}
                />
                <input className={styles.long_text_description} placeholder={'Type a description'} disabled={type === 'edit' ? false : true} />
                <div className={styles.long_text}>
                    <div className={styles.long_text_form}>
                        <textarea className={styles.long_text_input} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LongText;
