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
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: '#fff',
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

const CreateForm = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const { query } = router;

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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
                isRequire: false,
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
    const [modalSave, setModalSave] = useState(false);

    const onWelcomeTextChange = (e) => {
        setWelcomeText(e.target.value);
    };

    const onThanksTextChange = (e) => {
        setThanksText(e.target.value);
    };

    const onAddNewElement = (item) => {
        delete item.icon;
        forms.push({
            ...item,
        });
        setForms([...forms]);
    };

    const onElementChanged = ({ index, title, meta, isRequire }) => {
        forms[index] = {
            ...forms[index],
            defaultValue: {
                title,
                meta,
                isRequire,
            },
        };

        setForms([...forms]);
    };

    const onDeleteElement = (index) => {
        forms.splice(index, 1);
        setForms([...forms]);
    };

    const onSaveFormClicked = async () => {
        setModalSave(true);

        const seph = new Semaphore({
            max: 4,
        });

        const { contract } = wallet;
        const { id } = query;

        await Promise.all[
            forms?.map(async (element) => {
                const { type, defaultValue } = element;
                console.log(element);
                await seph.acquire();

                contract
                    .new_element({
                        formId: id,
                        type,
                        title: defaultValue.title,
                        meta: defaultValue.meta,
                        isRequired: defaultValue.isRequire,
                    })
                    .then((res) => {
                        console.log(res);
                        seph.release();
                    })
                    .catch((err) => {
                        console.log(err);
                        seph.release();
                    });
            })
        ];
    };

    const onCloseModalSave = () => {
        setModalSave(false);
    };

    const onPreviewClick = () => {
        localStorage.setItem('myForms', JSON.stringify(forms));
        router.push('create-form/preview-form');
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
                    <button className={styles.button}>Cancel</button>
                    <button className={styles.button} onClick={onPreviewClick}>
                        Preview Form
                    </button>
                    <button className={styles.button_save} onClick={onSaveFormClicked}>
                        Save to use latter
                    </button>
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
                                    {index !== 0 && (
                                        <div className={styles.button_prev}>
                                            <ArrowBackOutlinedIcon className={styles.icon_prev} />
                                            Previous
                                        </div>
                                    )}
                                    <div className={styles.button_next} style={index === 0 ? { borderBottomLeftRadius: 24, justifyContent: 'center' } : null}>
                                        {index < forms.length - 1 ? 'Next' : 'Submit'} <ArrowForwardOutlinedIcon className={styles.icon_next} />
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

            <Modal open={modalSave} onClose={onCloseModalSave} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Save Form
                    </Typography>
                    <div className={styles.modal_label}>Please wait while saving your form.</div>
                    <div className={styles.modal_content}>
                        <img src={'/loading.svg'} className={styles.modal_loading_icon} />
                    </div>
                    <div className={styles.modal_content_text}>Processing: 10/15 completed.</div>
                </Box>
            </Modal>
        </div>
    );
};

export default CreateForm;
