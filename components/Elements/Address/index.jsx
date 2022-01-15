import React, { useState } from 'react';
import styles from './Address.module.scss';

const Address = ({ index, onChange, defaultValue, type = '' }) => {
    const initValue = {
        title: 'Address',
        meta: [],
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const [title, setTitle] = useState(initValue?.title?.[0] || 'Address');
    const [first_field, setFirstField] = useState(initValue?.title?.[1] || 'Street Address');
    const [second_field, setSecondField] = useState(initValue?.title?.[2] || 'Street Address Line 2');
    const [third_field, setThirdField] = useState(initValue?.title?.[3] || 'City');
    const [fourth_field, setFourthField] = useState(initValue?.title?.[4] || 'State / Province');
    const [fifth_field, setFifthField] = useState(initValue?.title?.[5] || 'Postal / Zip Code');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [e.target.value, first_field, second_field, third_field, fourth_field, fifth_field],
                meta: [],
            });
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, e.target.value, second_field, third_field, fourth_field, fifth_field],
                meta: [],
            });
    };

    const onSecondFieldChange = (e) => {
        setSecondField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, first_field, e.target.value, third_field, fourth_field, fifth_field],
                meta: [],
            });
    };

    const onThirdFieldChange = (e) => {
        setThirdField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, first_field, second_field, e.target.value, fourth_field, fifth_field],
                meta: [],
            });
    };

    const onFourthFieldChange = (e) => {
        setFourthField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, first_field, second_field, third_field, e.target.value, fifth_field],
                meta: [],
            });
    };

    const onFifthFieldChange = (e) => {
        setFifthField(e.target.value);
        type === 'create' &&
            onChange?.({
                index,
                title: [title, first_field, second_field, third_field, fourth_field, e.target.value],
                meta: [],
            });
    };

    return (
        <div className={styles.root_address}>
            <div className={styles.address_content}>
                <input
                    className={styles.address_title}
                    value={title}
                    onChange={onTitleChange}
                    placeholder={'Type a title'}
                    disabled={type === 'create' ? false : true}
                />
                <input className={styles.address_description} placeholder={'Type a description'} disabled={type === 'create' ? false : true} />
                <div className={styles.address}>
                    <div className={styles.address_form}>
                        <input
                            className={styles.address_label}
                            value={first_field}
                            onChange={onFirstFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'create' ? false : true}
                        />
                        <input className={styles.address_input} disabled={type === 'answer' ? false : true} />
                    </div>
                    <div className={styles.address_form}>
                        <input
                            className={styles.address_label}
                            value={second_field}
                            onChange={onSecondFieldChange}
                            placeholder={'Type a field'}
                            disabled={type === 'create' ? false : true}
                        />
                        <input className={styles.address_input} disabled={type === 'answer' ? false : true} />
                    </div>
                    <div className={styles.address_row}>
                        <div className={styles.address_form_left}>
                            <input
                                className={styles.address_label}
                                value={third_field}
                                onChange={onThirdFieldChange}
                                placeholder={'Type a field'}
                                disabled={type === 'create' ? false : true}
                            />
                            <input className={styles.address_input} disabled={type === 'answer' ? false : true} />
                        </div>
                        <div className={styles.address_form_right}>
                            <input
                                className={styles.address_label}
                                value={fourth_field}
                                onChange={onFourthFieldChange}
                                placeholder={'Type a field'}
                                disabled={type === 'create' ? false : true}
                            />
                            <input className={styles.address_input} disabled={type === 'answer' ? false : true} />
                        </div>
                    </div>
                    <div className={styles.address_row}>
                        <div className={styles.address_form_left}>
                            <input
                                className={styles.address_label}
                                value={fifth_field}
                                onChange={onFifthFieldChange}
                                placeholder={'Type a field'}
                                disabled={type === 'create' ? false : true}
                            />
                            <input className={styles.address_input} disabled={type === 'answer' ? false : true} />
                        </div>
                        <div className={styles.address_form_right}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Address;
