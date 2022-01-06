import styles from './Header.module.scss';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const Header = () => {
    return (
        <div className={styles.root_header}>
            <div className={styles.header_content}>
                <input className={styles.heading_input} placeholder={'Heading'} />
                <input className={styles.subheader_input} placeholder={'Type a subheader'} />
                <div className={styles.header_text}>1 question(s)</div>
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

export default Header;
