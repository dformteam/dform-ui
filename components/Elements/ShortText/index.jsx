import React, { useEffect, useState } from 'react';
import styles from './ShortText.module.scss';
import Switch from '@mui/material/Switch';

const ShortText = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Type a question'],
        meta: [],
        isRequired: defaultValue?.isRequired,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }
    const [title, setTitle] = useState(initValue?.title?.[0] || 'Type a question');
    const [text, setText] = useState('');
    const [required, setRequired] = React.useState(true);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value],
                meta: [],
                isRequired: defaultValue?.isRequired,
            });
    };

    const onTextChange = (e) => {
        setText(e.target.value);
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
            setText(initValue?.meta?.[0] || '');
        }
    };

    useEffect(() => {
        onFillValue();
    }, []);

    const onChangeRequired = (event) => {
        setRequired(event.target.checked);
    };

    return (
        <div className={styles.root_short_text}>
            <div className={styles.short_text_content}>
                <input className={styles.short_text_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.short_text_description} placeholder={'Type a description'} />
                <div className={styles.short_textrequire}>
                    Question required: <Switch checked={required} onChange={onChangeRequired} />
                </div>
                <div className={styles.short_text}>
                    <div className={styles.short_text_form}>
                        <input className={styles.short_text_input} disabled={type === 'answer' ? false : true} value={text} onChange={onTextChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShortText;
