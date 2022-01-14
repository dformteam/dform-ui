import React, { useState } from 'react';
import styles from './FillBlank.module.scss';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const FillBlank = () => {
    const [aInputs, setInputs] = useState([
        { type: 'label', content: 'This is a fill in the' },
        { type: 'input_text', content: 'Blank' },
        { type: 'label', content: 'field. Please add appropriate' },
        { type: 'input_text', content: 'Blank' },
    ]);
    const [title, setTitle] = useState('Type a question');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onChangeInput = (e, index) => {
        aInputs[index].content = e.currentTarget.textContent;
    };

    const onDeleteInput = (index) => {
        let copyInputs = [...aInputs];
        copyInputs.splice(index, 1);
        setInputs(copyInputs);
    };

    const onAddLabel = () => {
        let copyInputs = [...aInputs];
        copyInputs.push({ type: 'label', content: 'Label' });
        setInputs(copyInputs);
    };

    const onAddInput = () => {
        let copyInputs = [...aInputs];
        copyInputs.push({ type: 'input_text', content: 'Blanks' });
        setInputs(copyInputs);
    };

    const renderInput = (item, index) => {
        switch (item.type) {
            case 'label':
                return (
                    <>
                        <p
                            contentEditable={true}
                            onInput={(e) => onChangeInput(e, index)}
                            suppressContentEditableWarning={true}
                            className={styles.fill_blank_input_label}
                        >
                            {item.content}
                        </p>
                        <div className={styles.fill_blank_input_clear} onClick={() => onDeleteInput(index)}>
                            <ClearOutlinedIcon className={styles.fill_blank_input_icon} />
                        </div>
                    </>
                );

            case 'input_text':
                return (
                    <>
                        <span
                            contentEditable={true}
                            onInput={(e) => onChangeInput(e, index)}
                            suppressContentEditableWarning={true}
                            className={styles.fill_blank_input_fill}
                        >
                            {item.content}
                        </span>
                        <div className={styles.fill_blank_input_clear} onClick={() => onDeleteInput(index)}>
                            <ClearOutlinedIcon className={styles.fill_blank_input_icon} />
                        </div>
                    </>
                );

            default:
                break;
        }
    };

    return (
        <div className={styles.root_fill_blank}>
            <div className={styles.fill_blank_content}>
                <input className={styles.fill_blank_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.fill_blank_description} placeholder={'Type a description'} />
                <div className={styles.fill_blank}>
                    <div className={styles.fill_blank_form}>
                        {aInputs?.map?.((item, index) => {
                            return (
                                <div className={styles.fill_blank_input} key={index}>
                                    {renderInput(item, index)}
                                </div>
                            );
                        })}
                        <span className={styles.fill_blank_add_label} onClick={onAddLabel}>
                            + Add label
                        </span>
                        <span className={styles.fill_blank_add_label} onClick={onAddInput}>
                            + Add input
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FillBlank;
