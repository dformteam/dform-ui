import React, { useState } from 'react';
import styles from './MultiChoice.module.scss';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const MultiChoice = ({ index, onChange, defaultValue, type = '' }) => {
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
        const metaAnswer = aAnswers?.filter((x) => x.content !== '')?.map((x) => x.content);
        type === 'edit' &&
            onChange?.({
                index,
                title: [e.target.value],
                meta: [...metaAnswer],
            });
    };

    const onOptionChange = (value, indexz) => {
        let copyAnswers = [...aAnswers];
        copyAnswers[indexz].content = value;
        setAnswers(copyAnswers);
        const metaAnswer = copyAnswers?.filter((x) => x.content !== '')?.map((x) => x.content);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title],
                meta: [...metaAnswer],
                isRequired: false,
            });
    };

    const onAddOption = () => {
        let copyAnswers = [...aAnswers];
        copyAnswers.push({ content: '', placeholder: 'Type option ' + (aAnswers.length + 1), check: false });
        setAnswers(copyAnswers);
    };

    const onDeleteOption = (indexz) => {
        let copyAnswers = [...aAnswers];
        copyAnswers.splice(indexz, 1);
        setAnswers(copyAnswers);
        const metaAnswer = copyAnswers?.filter((x) => x.content !== '')?.map((x) => x.content);
        setAnswers([
            ...copyAnswers.map((x, aIndex) => {
                x.placeholder = 'Type option ' + (aIndex + 1);
                return x;
            }),
        ]);
        type === 'edit' &&
            onChange?.({
                index,
                title: [title],
                meta: [...metaAnswer],
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
                    disabled={type === 'edit' ? false : true}
                />
                <input className={styles.multi_choice_description} placeholder={'Type a description'} disabled={type === 'edit' ? false : true} />
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
                                    placeholder={item.placeholder}
                                    onChange={(e) => onOptionChange(e.target.value, index)}
                                    disabled={type !== 'edit' ? true : false}
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
                    <div className={styles.multi_choice_form_add} onClick={onAddOption} disabled={type !== 'edit' ? true : false}>
                        <AddOutlinedIcon className={styles.multi_choice_checked_left} />
                        <div className={styles.multi_choice_add}>Add Option</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiChoice;
