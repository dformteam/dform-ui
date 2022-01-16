import React, { useState } from 'react';
import styles from './StarRating.module.scss';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

const StarRating = ({ index, onChange, defaultValue, type = '' }) => {
    const initValue = {
        title: ['Type a question'],
        meta: [],
        isRequired: false,
    };

    if (typeof defaultValue !== 'undefined') {
        initValue = { ...defaultValue };
    }

    const star = [1, 2, 3, 4, 5];
    const [title, setTitle] = useState(initValue?.title?.[0] || 'Type a question');
    const [active, setActive] = useState(null);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
        onChange?.({
            index,
            title: [e.target.value],
            meta: [],
            isRequired: false,
        });
    };

    const onStarClicked = (star) => {
        setActive(star);
    };

    return (
        <div className={styles.root_star_rating}>
            <div className={styles.star_rating_content}>
                <input className={styles.star_rating_title} value={title} onChange={onTitleChange} placeholder={'Type a title'} />
                <input className={styles.star_rating_description} placeholder={'Type a description'} />
                <div className={styles.star_rating}>
                    <div className={styles.star_rating_form}>
                        {star.map((item) => {
                            return (
                                <div
                                    onClick={() => onStarClicked(item)}
                                    className={item <= active ? styles.star_rating_active : styles.star_rating_item}
                                    key={item}
                                >
                                    <StarOutlinedIcon className={styles.star_rating_icon} />
                                    <div className={styles.star_rating_text}>{item}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.star_rating_row}>
                        <input className={styles.star_rating_input} placeholder={'Type "Worst" text'} />
                        <input className={styles.star_rating_input} placeholder={'Type "Best" text'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StarRating;