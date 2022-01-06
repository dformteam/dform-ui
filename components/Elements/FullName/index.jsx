import styles from './FullName.module.scss';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const FullName = () => {
    return (
        <div className={styles.root_full_name}>
            <div className={styles.full_name_content}>
                <div className={styles.full_name_title}>Name</div>
                <input className={styles.full_name_description} placeholder={'Type a description'} />
                <div className={styles.full_name}>
                    <div className={styles.full_name_form_left}>
                        <div className={styles.full_name_label}>First Name</div>
                        <input className={styles.full_name_input} />
                    </div>
                    <div className={styles.full_name_form_right}>
                        <div className={styles.full_name_label}>Last Name</div>
                        <input className={styles.full_name_input} />
                    </div>
                </div>
            </div>
            <div className={styles.button_submit}>
                <div className={styles.button_prev}>
                    <ArrowBackOutlinedIcon className={styles.icon_prev} />
                    Prev
                </div>
                <div className={styles.button_next}>
                    Next <ArrowForwardOutlinedIcon className={styles.icon_next} />
                </div>
            </div>
        </div>
    );
};

export default FullName;
