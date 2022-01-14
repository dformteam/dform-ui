import React, { useState } from 'react';
import styles from './ShortText.module.scss';

const ShortText = () => {
    const [title, setTitle] = useState('Type a question');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    return (
        <div className={styles.root_short_text}>
            <div className={styles.short_text_content}>
                <input className={styles.short_text_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.short_text_description} placeholder={'Type a description'} />
                <div className={styles.short_text}>
                    <div className={styles.short_text_form}>
                        <input className={styles.short_text_input} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShortText;
