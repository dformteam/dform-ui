/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './ShortText.module.scss';
import Switch from '@mui/material/Switch';

const ShortText = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
        title: ['Type a question'],
        meta: [],
        isRequired: false,
        error: '',
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }
    const [title, setTitle] = useState(initValue?.title?.[0] || 'Type a question');
    const [text, setText] = useState('');
    const [required, setRequired] = useState(initValue.isRequired || false);
    const [error, setError] = useState(initValue.error);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value],
                meta: [],
                isRequired: required,
            });
    };

    const onTextChange = (e) => {
        setText(e.target.value);
        setError('');
        type === 'answer' &&
            onChange?.({
                index,
                title: [title],
                meta: [e.target.value],
                isRequired: required,
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

    const onChangeRequired = (e) => {
        setRequired(e.target.checked);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title],
                meta: [],
                isRequired: e.target.checked,
            });
    };

    return (
        <div className={styles.root_short_text}>
            <div className={styles.short_text_content}>
                <input className={styles.short_text_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.short_text_description} placeholder={'Type a description'} />
                {type === 'edit' && (
                    <div className={styles.short_textrequire}>
                        Question required: <Switch checked={required} onChange={onChangeRequired} />
                    </div>
                )}
                <div className={styles.short_text}>
                    <div className={styles.short_text_form}>
                        <input className={styles.short_text_input} disabled={type === 'answer' ? false : true} value={text} onChange={onTextChange} />
                        {error !== '' && <div className={styles.text_error}>Error</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShortText;
