import React, { useState } from 'react';
import styles from './SingleChoice.module.scss';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const SingleChoice = ({ index, onChange, defaultValue, type = '' }) => {
    let initValue = {
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
        onChange?.({
            index,
            title: [e.target.value],
            meta: [...aAnswers],
            isRequired: false,
        });
    };

    const onOptionChange = (value, indexz) => {
        let copyAnswers = [...aAnswers];
        copyAnswers[indexz].content = value;
        setAnswers(copyAnswers);
        onChange?.({
            index,
            title: [value],
            meta: [...copyAnswers],
            isRequired: false,
        });
    };

    const onAddOption = (e) => {
        let copyAnswers = [...aAnswers];
        copyAnswers.push({ content: 'Type option ' + (aAnswers.length + 1), check: false });
        setAnswers(copyAnswers);
        onChange?.({
            index,
            title: [e.target.value],
            meta: [...copyAnswers],
            isRequired: false,
        });
    };

    const onDeleteOption = (e, indexz) => {
        let copyAnswers = [...aAnswers];
        copyAnswers.splice(indexz, 1);
        setAnswers(copyAnswers);
        onChange?.({
            index,
            title: [e.target.value],
            meta: [...copyAnswers],
            isRequired: false,
        });
    };

    return (
        <div className={styles.root_single_choice}>
            <div className={styles.single_choice_content}>
                <input className={styles.single_choice_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.single_choice_description} placeholder={'Type a description'} />
                <div className={styles.single_choice}>
                    {aAnswers?.map?.((item, index) => {
                        return (
                            <div className={index % 2 === 0 ? styles.single_choice_form_left : styles.single_choice_form_right} key={index}>
                                {item.check ? (
                                    <RadioButtonCheckedOutlinedIcon
                                        className={index % 2 === 0 ? styles.single_choice_checked_left : styles.single_choice_checked_right}
                                    />
                                ) : (
                                    <RadioButtonUncheckedOutlinedIcon
                                        className={index % 2 === 0 ? styles.single_choice_checked_left : styles.single_choice_checked_right}
                                    />
                                )}
                                <input
                                    className={styles.single_choice_input}
                                    value={item.content}
                                    placeholder={'Type an option'}
                                    onChange={(e) => onOptionChange(e.target.value, index)}
                                />
                                <div
                                    className={index % 2 === 0 ? styles.single_choice_delete_left : styles.single_choice_delete_right}
                                    onClick={(e) => onDeleteOption(e, index)}
                                >
                                    <DeleteOutlinedIcon className={styles.single_choice_delete_icon} />
                                </div>
                            </div>
                        );
                    })}
                    <div className={styles.single_choice_form_add} onClick={onAddOption}>
                        <AddOutlinedIcon className={styles.single_choice_checked_left} />
                        <div className={styles.single_choice_add}>Add Option</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleChoice;
