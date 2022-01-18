import { Fragment, useLayoutEffect, useState } from 'react';
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
import CloseIcon from '@mui/icons-material/Close';
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
import PreviewForm from '../../../components/PreviewForm';
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
    const raws = [];
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const { query } = router;

    const listElement = [
        {
            bId: '',
            id: 'header',
            type: 0,
            label: 'Header',
            icon: TitleOutlinedIcon,
            defaultValue: {
                title: [],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'fullName',
            type: 1,
            label: 'Full Name',
            icon: AccountCircleOutlinedIcon,
            defaultValue: {
                title: ['Name', 'First Name', 'Last Name'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'email',
            type: 2,
            label: 'Email',
            icon: EmailOutlinedIcon,
            defaultValue: {
                title: ['Email', 'Email.'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'address',
            type: 3,
            label: 'Address',
            icon: LocationOnOutlinedIcon,
            defaultValue: {
                title: ['Address', 'Street Address', 'Street Address Line 2', 'City', 'State / Province', 'Postal / Zip Code'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'phone',
            type: 4,
            label: 'Phone',
            icon: LocalPhoneOutlinedIcon,
            defaultValue: {
                title: ['Phone Number', 'Please enter a valid phone number.'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'datePicker',
            type: 5,
            label: 'Date Picker',
            icon: DateRangeOutlinedIcon,
            defaultValue: {
                title: ['Date Picker', 'Please pick a date.'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'fillBlank',
            type: 6,
            label: 'Fill in the Blank',
            icon: FormatSizeOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'shortText',
            type: 7,
            label: 'Shot Text',
            icon: ShortTextOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'longText',
            type: 8,
            label: 'Long text',
            icon: ChromeReaderModeOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'singleChoice',
            type: 9,
            label: 'Single Choice',
            icon: AdjustOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'multiChoice',
            type: 10,
            label: 'Multi Choice',
            icon: CheckBoxOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'time',
            type: 11,
            label: 'Time',
            icon: AccessTimeOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
                isRequired: false,
            },
        },
        {
            bId: '',
            id: 'rating',
            type: 12,
            label: 'Rating',
            icon: StarOutlineOutlinedIcon,
            defaultValue: {
                title: ['Type a question'],
                meta: [],
                isRequired: false,
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
    const [isSuccess, setSuccess] = useState(false);
    const [executing, setExecuting] = useState(0);
    const [processing, setProcessing] = useState(0);
    const [modalPreview, setModalPreview] = useState(0);
    const [forms_upload_failure, setFormUploadFailure] = useState([]);

    useLayoutEffect(() => {
        onGetMaxElement();
    }, []);

    const onGetMaxElement = () => {
        const { contract } = wallet;
        const { id } = query;

        contract
            ?.get_element_count?.({
                formId: id,
            })
            .then((res) => {
                if (res) {
                    onGetElements({ total: res });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetElements = ({ total }) => {
        const { contract, walletConnection } = wallet;
        const num_page = parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        setForms([]);

        const userId = walletConnection.getAccountId();
        const { id } = query;
        page_arr.map((page, index) => {
            contract
                .get_elements({
                    userId,
                    formId: id,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        console.log(data);
                        const pIndex = raws.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            raws.push(data);
                            raws.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let forms = [];
                            raws.map((raw) => {
                                const transform_form = raw?.data?.map((data) => {
                                    return {
                                        bId: data.id,
                                        id: listElement?.[data.type]?.id,
                                        type: data.type,
                                        label: listElement?.[data.type]?.label,
                                        icon: ShortTextOutlinedIcon,
                                        defaultValue: {
                                            title: data?.title,
                                            meta: data?.meta,
                                            isRequire: data?.isRequired,
                                        },
                                        edited: false,
                                    };
                                });
                                forms = [...forms, ...(transform_form || [])];
                            });
                            console.log(forms);
                            setForms([...forms]);
                        }
                    }
                });
        });
    };

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

    const onElementChanged = ({ index, title, meta, isRequired }) => {
        forms[index] = {
            ...forms[index],
            defaultValue: {
                title,
                meta,
                isRequired,
            },
            edited: true,
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

        const excecute_count = forms.filter((x) => {
            const { bId, edited } = x;
            return typeof bId === 'undefined' || bId === '' || bId === null || edited;
        }).length;

        setExecuting(excecute_count);

        await Promise.all[
            forms?.map(async (element) => {
                const { type, defaultValue, bId, edited } = element;
                if (typeof bId === 'undefined' || bId === '' || bId === null) {
                    await seph.acquire();

                    contract
                        .new_element({
                            formId: id,
                            type,
                            title: defaultValue.title,
                            meta: defaultValue.meta,
                            isRequired: defaultValue.isRequired,
                        })
                        .then((res) => {
                            setProcessing(processing + 1);
                            if (!res) {
                                setFormUploadFailure([...forms_upload_failure, { ...element }]);
                            } else {
                                element = {
                                    ...element,
                                    bId: res.bId,
                                };
                            }
                            seph.release();
                        })
                        .catch((err) => {
                            console.log(err);
                            setFormUploadFailure([...forms_upload_failure, { ...element }]);
                            seph.release();
                        });
                } else if (edited) {
                    contract
                        .update_element({
                            formId: id,
                            id: element.bId,
                            title: defaultValue.title,
                            meta: defaultValue.meta,
                            isRequired: defaultValue.isRequired,
                        })
                        .then((res) => {
                            setProcessing(processing + 1);
                            if (!res) {
                                setFormUploadFailure([...forms_upload_failure, { ...element }]);
                            } else {
                                element = {
                                    ...element,
                                    bId: res.bId,
                                };
                            }
                            seph.release();
                        })
                        .catch((err) => {
                            console.log(err);
                            setFormUploadFailure([...forms_upload_failure, { ...element }]);
                            seph.release();
                        });
                }
            })
        ];
    };

    const onCloseModalSave = () => {
        setModalSave(false);
    };

    const onCloseModalPreview = () => {
        setModalPreview(false);
    };

    const onPreviewClick = () => {
        setModalPreview(true);
        localStorage.setItem('myForms', JSON.stringify(forms));
        // router.push('create-form/preview-form');
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
                    <div className={styles.line} />
                    {isSuccess ? (
                        <>
                            <div className={styles.modal_label + ' ' + styles.margin_top}>Your form has been successfully saved.</div>
                            <div className={styles.modal_label}>Are you want to?</div>
                            <div className={styles.modal_row}>
                                <button className={styles.modal_button_publish}>Publish</button>
                                <div className={styles.modal_text}>Or: </div>
                                <div className={styles.modal_button}>Go to homepage</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.modal_label + ' ' + styles.margin_top}>Please wait while saving your form.</div>
                            <div className={styles.modal_content}>
                                <img src={'/loading.svg'} className={styles.modal_loading_icon} />
                            </div>
                            <div className={styles.modal_content_text}>
                                Processing: {processing}/{executing} completed.
                            </div>
                        </>
                    )}
                </Box>
            </Modal>

            <Modal open={modalPreview} onClose={onCloseModalPreview} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={{ width: '100vw', height: '100vh' }}>
                    <div className={styles.modal_preview_content}>
                        <div className={styles.modal_preview_content_title}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Preview form
                            </Typography>
                            <div className={styles.line} />
                        </div>
                        <div className="form_bg" />
                        <div className={styles.modal_preview_close} onClick={onCloseModalPreview}>
                            <CloseIcon />
                        </div>
                        <div className={styles.preview_content}>
                            <PreviewForm />
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default CreateForm;
