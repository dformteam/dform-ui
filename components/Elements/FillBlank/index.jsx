import React, { useState } from 'react';
import styles from './FillBlank.module.scss';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const FillBlank = () => {
    const [aInputs, setInputs] = useState([
        { type: 'label', content: 'This is a fill in the' },
        { type: 'input_text', content: '' },
        { type: 'label', content: 'field. Please add appropriate' },
        { type: 'input_text', content: '' },
    ]);
    const [title, setTitle] = useState('Type a question');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onChangeInput = (e, index) => {
        aInputs[index].content = e.currentTarget.textContent;
    };

    const onDeleteInput = (index) => {
        aInputs.splice(index, 1);
        aInputs = [...aInputs];
        setInputs(aInputs);
    };

    const onAddLabel = () => {
        aInputs.push({ type: 'label', content: 'Label' });
        aInputs = [...aInputs];
        setInputs(aInputs);
    };

    const onAddInput = () => {
        aInputs.push({ type: 'input_text', content: 'Blanks' });
        aInputs = [...aInputs];
        setInputs(aInputs);
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
