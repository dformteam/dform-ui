import { Fragment } from 'react';
import styles from './CreateForm.module.scss';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import FormatSizeOutlinedIcon from '@mui/icons-material/FormatSizeOutlined';
import ShortTextOutlinedIcon from '@mui/icons-material/ShortTextOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import Header from '../../../components/Elements/Header';
import FullName from '../../../components/Elements/FullName';

const CreateForm = () => {
    const listElement = [
        { id: 'header', label: 'Header', icon: TitleOutlinedIcon },
        { id: 'fullName', label: 'Full Name', icon: AccountCircleOutlinedIcon },
        { id: 'email', label: 'Email', icon: EmailOutlinedIcon },
        { id: 'address', label: 'Address', icon: LocationOnOutlinedIcon },
        { id: 'phone', label: 'Phone', icon: LocalPhoneOutlinedIcon },
        { id: 'datePicker', label: 'Date Picker', icon: DateRangeOutlinedIcon },
        { id: 'fillBlank', label: 'Fill in the Blank', icon: FormatSizeOutlinedIcon },
        { id: 'shortText', label: 'Shot Text', icon: ShortTextOutlinedIcon },
        { id: 'longText', label: 'Long text', icon: ChromeReaderModeOutlinedIcon },
        { id: 'singleChoice', label: 'Single Choice', icon: AdjustOutlinedIcon },
        { id: 'multiChoice', label: 'Multi Choice', icon: CheckBoxOutlinedIcon },
        { id: 'time', label: 'Time', icon: AccessTimeOutlinedIcon },
        { id: 'rating', label: 'Rating', icon: StarOutlineOutlinedIcon },
    ];

    const aForm = [];

    return (
        <div className={styles.root}>
            <div className={styles.nav}>
                <div className={styles.label}>Form Elements</div>
                <div className={styles.element}>
                    {listElement?.map?.((item) => {
                        return (
                            <Fragment key={item.id}>
                                <div className={styles.line} />
                                <div className={styles.element_item}>
                                    <div className={styles.element_icon}>
                                        <item.icon className={styles.element_icon_img} fontSize="large" />
                                    </div>
                                    <div className={styles.element_label}>{item.label}</div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.button_area}>
                    <button className={styles.button}>Build</button>
                    <button className={styles.button}>Publish</button>
                    <button className={styles.button}>Preview Form</button>
                </div>
                <div className={styles.content}>
                    <div className={styles.welcome}>
                        <div className={styles.welcome_title}>Welcome!</div>
                        <div className={styles.welcome_text}>Please fill out and submit this form.</div>
                        <button className={styles.welcome_button}>
                            Start <ArrowForwardOutlinedIcon className={styles.icon_next} />
                        </button>
                    </div>
                    <div className={styles.element_content}>
                        <Header />
                    </div>
                    <div className={styles.element_content}>
                        <FullName />
                    </div>
                    <div className={styles.end}>
                        <div className={styles.welcome_title}>Thank You!</div>
                        <div className={styles.welcome_text}>Your submission has been received.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateForm;
