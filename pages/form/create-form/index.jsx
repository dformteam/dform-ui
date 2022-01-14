import { Fragment, useState } from 'react';
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
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Header from '../../../components/Elements/Header';
import FullName from '../../../components/Elements/FullName';
import Email from '../../../components/Elements/Email';
import Address from '../../../components/Elements/Address';
import Phone from '../../../components/Elements/Phone';
import DatePicker from '../../../components/Elements/DatePicker';
import ShortText from '../../../components/Elements/ShortText';
import LongText from '../../../components/Elements/LongText';
import Time from '../../../components/Elements/Time';
import StarRating from '../../../components/Elements/StarRating';
import SingleChoice from '../../../components/Elements/SingleChoice';
import MultiChoice from '../../../components/Elements/MultiChoice';
import FillBlank from '../../../components/Elements/FillBlank';

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

    const aForm = [
        { id: 'header', label: 'Header' },
        { id: 'fullName', label: 'Full Name' },
        { id: 'email', label: 'Email' },
        { id: 'address', label: 'Address' },
        { id: 'phone', label: 'Phone' },
        { id: 'datePicker', label: 'Date Picker' },
        { id: 'fillBlank', label: 'Fill in the Blank' },
        { id: 'shortText', label: 'Shot Text' },
        { id: 'longText', label: 'Long text' },
        { id: 'singleChoice', label: 'Single Choice' },
        { id: 'multiChoice', label: 'Multi Choice' },
        { id: 'time', label: 'Time' },
        { id: 'rating', label: 'Rating' },
    ];

    const renderElement = (el) => {
        switch (el) {
            case 'header':
                return <Header />;
            case 'fullName':
                return <FullName />;
            case 'email':
                return <Email />;
            case 'address':
                return <Address />;
            case 'phone':
                return <Phone />;
            case 'datePicker':
                return <DatePicker />;
            case 'shortText':
                return <ShortText />;
            case 'longText':
                return <LongText />;
            case 'time':
                return <Time />;
            case 'rating':
                return <StarRating />;
            case 'singleChoice':
                return <SingleChoice />;
            case 'multiChoice':
                return <MultiChoice />;
            case 'fillBlank':
                return <FillBlank />;

            default:
                break;
        }
    };
    const [welcomeText, setWelcomeText] = useState('Please fill out and submit this form.');
    const [thanksText, setThanksText] = useState('Your submission has been received.');

    const onWelcomeTextChange = (e) => {
        setWelcomeText(e.target.value);
    };

    const onThanksTextChange = (e) => {
        setThanksText(e.target.value);
    };

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
                        <input className={styles.welcome_text} value={welcomeText} onChange={onWelcomeTextChange} />
                        <button className={styles.welcome_button}>
                            Start <ArrowForwardOutlinedIcon className={styles.icon_next} />
                        </button>
                    </div>
                    {aForm?.map?.((item) => {
                        return (
                            <div className={styles.element_content} key={item.id}>
                                {renderElement(item.id)}
                                <div className={styles.button_submit}>
                                    <div className={styles.button_prev}>
                                        <ArrowBackOutlinedIcon className={styles.icon_prev} />
                                        Previous
                                    </div>
                                    <div className={styles.button_next}>
                                        Next <ArrowForwardOutlinedIcon className={styles.icon_next} />
                                    </div>
                                </div>
                                <button className={styles.button_delete}>
                                    <DeleteForeverOutlinedIcon className={styles.button_delete_icon} />
                                </button>
                            </div>
                        );
                    })}
                    <div className={styles.end}>
                        <div className={styles.welcome_title}>Thank You!</div>
                        <input className={styles.welcome_text} value={thanksText} onChange={onThanksTextChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateForm;
