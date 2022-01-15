import React, { useState } from 'react';
import styles from './MultiChoice.module.scss';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const MultiChoice = ({ index, onChange, defaultValue, type = '' }) => {
    const initValue = {
        title: ['Type a question'],
        meta: [
            { content: 'Type option 1', check: false },
            { content: 'Type option 2', check: false },
            { content: 'Type option 3', check: false },
            { content: 'Type option 4', check: false },
        ],
        isRequired: false,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Type a question');
    const [aAnswers, setAnswers] = useState(initValue?.meta);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [e.target.value],
                meta: [...aAnswers],
            });
    };

    const onOptionChange = (value, indexz) => {
        let copyAnswers = [...aAnswers];
        copyAnswers[indexz].content = value;
        setAnswers(copyAnswers);
        type === 'create' &&
            onChange?.({
                index,
                title: [title],
                meta: [...aAnswers],
                isRequired: false,
            });
    };

    const onAddOption = () => {
        let copyAnswers = [...aAnswers];
        copyAnswers.push({ content: 'Type option ' + (aAnswers.length + 1), check: false });
        setAnswers(copyAnswers);
        type === 'create' &&
            onChange?.({
                index,
                title: [title],
                meta: [...aAnswers],
                isRequired: false,
            });
    };

    const onDeleteOption = (indexz) => {
        let copyAnswers = [...aAnswers];
        copyAnswers.splice(indexz, 1);
        setAnswers(copyAnswers);
        type === 'create' &&
            onChange?.({
                index,
                title: [title],
                meta: [...aAnswers],
                isRequired: false,
            });
    };

    return (
        <div className={styles.root_multi_choice}>
            <div className={styles.multi_choice_content}>
                <input
                    className={styles.multi_choice_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'create' ? false : true}
                />
                <input className={styles.multi_choice_description} placeholder={'Type a description'} disabled={type === 'create' ? false : true} />
                <div className={styles.multi_choice}>
                    {aAnswers?.map?.((item, index) => {
                        return (
                            <div className={index % 2 === 0 ? styles.multi_choice_form_left : styles.multi_choice_form_right} key={index}>
                                {item.check ? (
                                    <CheckBoxOutlinedIcon className={index % 2 === 0 ? styles.multi_choice_checked_left : styles.multi_choice_checked_right} />
                                ) : (
                                    <CheckBoxOutlineBlankOutlinedIcon
                                        className={index % 2 === 0 ? styles.multi_choice_checked_left : styles.multi_choice_checked_right}
                                    />
                                )}
                                <input
                                    className={styles.multi_choice_input}
                                    value={item.content}
                                    placeholder={'Type an option'}
                                    onChange={(e) => onOptionChange(e.target.value, index)}
                                    disabled={type === 'create' ? false : true}
                                />
                                <div
                                    className={index % 2 === 0 ? styles.multi_choice_delete_left : styles.multi_choice_delete_right}
                                    onClick={() => onDeleteOption(index)}
                                >
                                    <DeleteOutlinedIcon className={styles.multi_choice_delete_icon} />
                                </div>
                            </div>
                        );
                    })}
                    <div className={styles.multi_choice_form_add} onClick={onAddOption}>
                        <AddOutlinedIcon className={styles.multi_choice_checked_left} />
                        <div className={styles.multi_choice_add}>Add Option</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiChoice;
