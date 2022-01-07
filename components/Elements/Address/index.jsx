import React, { useState } from 'react';
import styles from './Address.module.scss';

const Address = () => {
    const [title, setTitle] = useState('Address');
    const [first_field, setFirstField] = useState('Street Address');
    const [second_field, setSecondField] = useState('Street Address Line 2');
    const [third_field, setThirdField] = useState('City');
    const [fourth_field, setFourthField] = useState('State / Province');
    const [fifth_field, setFifthField] = useState('Postal / Zip Code');

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onFirstFieldChange = (e) => {
        setFirstField(e.target.value);
    };

    const onSecondFieldChange = (e) => {
        setSecondField(e.target.value);
    };

    const onThirdFieldChange = (e) => {
        setThirdField(e.target.value);
    };

    const onFourthFieldChange = (e) => {
        setFourthField(e.target.value);
    };

    const onFifthFieldChange = (e) => {
        setFifthField(e.target.value);
    };

    return (
        <div className={styles.root_address}>
            <div className={styles.address_content}>
                <input className={styles.address_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.address_description} placeholder={'Type a description'} />
                <div className={styles.address}>
                    <div className={styles.address_form}>
                        <input className={styles.address_label} value={first_field} onChange={onFirstFieldChange} placeholder={'Type a field'} />
                        <input className={styles.address_input} />
                    </div>
                    <div className={styles.address_form}>
                        <input className={styles.address_label} value={second_field} onChange={onSecondFieldChange} placeholder={'Type a field'} />
                        <input className={styles.address_input} />
                    </div>
                    <div className={styles.address_row}>
                        <div className={styles.address_form_left}>
                            <input className={styles.address_label} value={third_field} onChange={onThirdFieldChange} placeholder={'Type a field'} />
                            <input className={styles.address_input} />
                        </div>
                        <div className={styles.address_form_right}>
                            <input className={styles.address_label} value={fourth_field} onChange={onFourthFieldChange} placeholder={'Type a field'} />
                            <input className={styles.address_input} />
                        </div>
                    </div>
                    <div className={styles.address_row}>
                        <div className={styles.address_form_left}>
                            <input className={styles.address_label} value={fifth_field} onChange={onFifthFieldChange} placeholder={'Type a field'} />
                            <input className={styles.address_input} />
                        </div>
                        <div className={styles.address_form_right}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Address;
