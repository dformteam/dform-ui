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
import Semaphore from '../../../backed/semaphore';

const CreateForm = () => {
    const listElement = [
        { id: 'header', type: 1, label: 'Header', icon: TitleOutlinedIcon },
        {
            id: 'fullName',
            type: 2,
            label: 'Full Name',
            icon: AccountCircleOutlinedIcon,
            defaultValue: {
                title: ['Name', 'First Name', 'Last Name'],
                meta: [],
            },
        },
        {
            id: 'email',
            type: 2,
            label: 'Email',
            icon: EmailOutlinedIcon,
            defaultValue: {
                title: ['Email', 'Email.'],
                meta: [],
            },
        },
        {
            id: 'address',
            type: 2,
            label: 'Address',
            icon: LocationOnOutlinedIcon,
            defaultValue: {
                title: ['Address', 'Street Address', 'Street Address Line 2', 'City', 'State / Province', 'Postal / Zip Code'],
                meta: [],
            },
        },
        {
            id: 'phone',
            type: 2,
            label: 'Phone',
            icon: LocalPhoneOutlinedIcon,
            defaultValue: {
                title: ['Phone Number', 'Please enter a valid phone number.'],
                meta: [],
            },
        },
        {
            id: 'datePicker',
            type: 2,
            label: 'Date Picker',
            icon: DateRangeOutlinedIcon,
            defaultValue: {
                title: ['Date Picker', 'Please pick a date.'],
                meta: [],
            },
        },
        {
            id: 'fillBlank',
            type: 2,
            label: 'Fill in the Blank',
            icon: FormatSizeOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
            },
        },
        {
            id: 'shortText',
            type: 2,
            label: 'Shot Text',
            icon: ShortTextOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
            },
        },
        {
            id: 'longText',
            type: 2,
            label: 'Long text',
            icon: ChromeReaderModeOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
            },
        },
        {
            id: 'singleChoice',
            type: 2,
            label: 'Single Choice',
            icon: AdjustOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
            },
        },
        {
            id: 'multiChoice',
            type: 2,
            label: 'Multi Choice',
            icon: CheckBoxOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
            },
        },
        {
            id: 'time',
            type: 2,
            label: 'Time',
            icon: AccessTimeOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
            },
        },
        {
            id: 'rating',
            type: 2,
            label: 'Rating',
            icon: StarOutlineOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
            },
        },
    ];

    const renderElement = (el, index) => {
        const { type, id, defaultValue } = el;

        switch (id) {
            case 'header':
                return <Header />;
            case 'fullName':
                return <FullName index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'email':
                return <Email index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'address':
                return <Address index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'phone':
                return <Phone index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'datePicker':
                return <DatePicker index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'shortText':
                return <ShortText index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'longText':
                return <LongText index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'time':
                return <Time index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'rating':
                return <StarRating index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'singleChoice':
                return <SingleChoice index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'multiChoice':
                return <MultiChoice index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;
            case 'fillBlank':
                return <FillBlank index={index} onChange={onElementChanged} elType={type} type={'create'} defaultValue={defaultValue} />;

            default:
                break;
        }
    };

    const [welcomeText, setWelcomeText] = useState('Please fill out and submit this form.');
    const [thanksText, setThanksText] = useState('Your submission has been received.');
    const [forms, setForms] = useState([]);

    const onWelcomeTextChange = (e) => {
        setWelcomeText(e.target.value);
    };

    const onThanksTextChange = (e) => {
        setThanksText(e.target.value);
    };

    const onAddNewElement = (item) => {
        forms.push({
            ...item,
        });
        setForms([...forms]);
    };

    const onElementChanged = ({ index, title, meta }) => {
        console.log(index, title, meta);
        console.log(333, forms[index]);
        forms[index] = {
            ...forms[index],
            defaultValue: {
                title,
                meta,
            },
        };

        console.log(4444, forms);
        setForms([...forms]);
    };

    const onDeleteElement = (index) => {
        forms.splice(index, 1);
        setForms([...forms]);
    };

    const onSaveFormClicked = () => {
        const seph = new Semaphore({
            max: 1,
        });
    };

    return (
        <div className={styles.root}>
            <div className={styles.nav}>
                <div className={styles.label}>Form Elements</div>
                <div className={styles.element}>
                    {listElement?.map?.((item, index) => {
                        return (
                            <Fragment key={item.id}>
                                <div className={styles.line} />
                                <div className={styles.element_item} onClick={() => onAddNewElement(item, index)}>
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
                    <button className={styles.button} onClick={onSaveFormClicked}>
                        Save to use latter
                    </button>
                    <button className={styles.button}>Cancel</button>
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
                    {forms?.map?.((item, index) => {
                        return (
                            <div className={styles.element_content} key={index}>
                                {renderElement(item, index)}
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
                                    <DeleteForeverOutlinedIcon className={styles.button_delete_icon} onClick={() => onDeleteElement(index)} />
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
