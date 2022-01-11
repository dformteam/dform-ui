import React, { useState } from 'react';
import styles from './LongText.module.scss';

const LongText = () => {
    const [title, setTitle] = useState('Type a question');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    return (
        <div className={styles.root_long_text}>
            <div className={styles.long_text_content}>
                <input className={styles.long_text_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.long_text_description} placeholder={'Type a description'} />
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
