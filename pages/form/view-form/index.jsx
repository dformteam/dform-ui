import { Fragment, useLayoutEffect, useState } from 'react';
import styles from './ViewForm.module.scss';
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditIcon from '@mui/icons-material/Edit';
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
import Notify from '../../../components/Notify';

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

    const [actions, setAction] = useState([]);
    const [form, setForm] = useState({});
    const [elements, setElements] = useState([]);
    const [modalPreview, setModalPreview] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [forms_status, setFormStatus] = useState('');
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [editingElement, setEditingElement] = useState({});

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenSnack(true);
        setOpenLoading(false);
        setAlertType(type);
        setSnackMsg(msg);
    };

    useLayoutEffect(() => {
        onGetFormDetail();
        return () => {
            localStorage.removeItem('myForms');
        };
    }, []);

    useLayoutEffect(() => {
        onGetMaxElement();
    }, [forms_status]);

    const onGetFormDetail = () => {
        const { contract, walletConnection } = wallet;
        const { id } = query;
        const content = 'Could not found any object have that id!';
        const encoded_content = encodeURIComponent(content);
        if (id === null || id === '' || typeof id === 'undefined') {
            router.push(`/error?content=${encoded_content}`);
        }
        contract
            ?.get_form?.({
                id: id,
            })
            .then((res) => {
                if (res) {
                    const { status, owner } = res;
                    const content = '';
                    const userId = walletConnection.getAccountId();
                    if (userId !== owner) {
                        content = 'You do not have permssion to edit this form!';
                    }

                    if (content !== '') {
                        const encoded_content = encodeURIComponent(content);
                        router.push(`/error?content=${encoded_content}`);
                    }

                    setForm({ ...res });
                    renderAction(res);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

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
        setElements([]);

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
                        const pIndex = raws.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            raws.push(data);
                            raws.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let elements = [];
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
                                        editable: false,
                                    };
                                });
                                elements = [...elements, ...(transform_form || [])];
                            });
                            setElements([...elements]);
                        }
                    }
                });
        });
    };

    const onPublishForm = () => {
        const id = query.id;
        router.push(`/form/edit-form/publish?id=${id}`);
    };

    const onCloseModalPreview = () => {
        localStorage.removeItem('myForms');
        setModalPreview(false);
    };

    const onCloseModalEdit = () => {
        setModalEdit(false);
    };

    const onPreviewClick = () => {
        localStorage.setItem('myForms', JSON.stringify(elements));
        setModalPreview(true);
    };

    const onEditFormClick = () => {
        setModalEdit(true);
    };

    const onAddNewQuestion = () => {
        const id = query.id;
        router.push(`/form/edit-form?id=${id}`);
    };

    const onEditElementClick = (item) => {
        setEditingElement({
            ...item,
            editable: true,
        });
        setModalEdit(true);
    };

    const onAnalysisClick = () => {};

    const renderAction = (form) => {
        const { status, start_date, end_date } = form;
        const cTimestamp = Date.now();
        let action = [];
        if (status === 0) {
            action = [
                {
                    title: 'Add new question',
                    onClick: onAddNewQuestion,
                },
                {
                    title: 'Preview',
                    onClick: onPreviewClick,
                },
            ];
        } else if (status === 1 && cTimestamp < start_date) {
            action = [
                {
                    title: 'Unpublish',
                    onClick: onEditFormClick,
                },
                {
                    title: 'Preview',
                    onClick: onPreviewClick,
                },
            ];
        } else if (status === 1 && cTimestamp > start_date && cTimestamp < end_date) {
            action = [
                {
                    title: 'Unpublish',
                    onClick: onEditFormClick,
                },
                {
                    title: 'Preview',
                    onClick: onPreviewClick,
                },
                {
                    title: 'Analysis',
                    onClick: onAnalysisClick,
                },
            ];
        } else if ((status === 1 && cTimestamp > end_date) || status === 2) {
            action = [
                {
                    title: 'Preview',
                    onClick: onPreviewClick,
                },
                {
                    title: 'Analysis',
                    onClick: onAnalysisClick,
                },
            ];
        }

        setAction([...action]);
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

        if (JSON.stringify(forms) !== JSON.stringify(raw_forms)) {
            setHasUpdate(true);
        } else {
            setHasUpdate(false);
        }

        setForms([...forms]);
    };

    const renderElement = (el, index) => {
        const { type, editable, id, defaultValue } = el;

        const editableType = editable ? 'edit' : 'view';

        switch (id) {
            case 'header':
                return <Header />;
            case 'fullName':
                return <FullName index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'email':
                return <Email index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'address':
                return <Address index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'phone':
                return <Phone index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'datePicker':
                return <DatePicker index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'shortText':
                return <ShortText index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'longText':
                return <LongText index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'time':
                return <Time index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'rating':
                return <StarRating index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'singleChoice':
                return <SingleChoice index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'multiChoice':
                return <MultiChoice index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;
            case 'fillBlank':
                return <FillBlank index={index} onChange={onElementChanged} elType={type} type={editableType} defaultValue={defaultValue} />;

            default:
                break;
        }
    };

    const renderForms = (item, index) => {
        return (
            <div className={styles.element_content} key={index}>
                {renderElement(item, index)}
                <div className={styles.element_action_area}>
                    <button className={styles.element_action_area__edit}>
                        <EditIcon className={styles.button_delete_icon} onClick={() => onEditElementClick(item)} />
                    </button>
                    <button className={styles.element_action_area__delete}>
                        <DeleteForeverOutlinedIcon className={styles.button_delete_icon} onClick={() => onDeleteElement(index)} />
                    </button>
                </div>
                {/* <div className={styles.element_bg}></div> */}
            </div>
        );
    };

    const renderIcon = (title) => {
        switch (title) {
            case 'Edit':
                return <EditIcon className={styles.button_area_icon} />;
            case 'Preview':
                return <VisibilityOutlinedIcon className={styles.button_area_icon} />;
            case 'Unpublish':
                return <UnpublishedOutlinedIcon className={styles.button_area_icon} />;
            case 'Analysis':
                return <InsertChartOutlinedOutlinedIcon className={styles.button_area_icon} />;
            case 'Add new question':
                return <AddOutlinedIcon className={styles.button_area_icon} />;

            default:
                break;
        }
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.button_area}>
                        {actions?.map((action, index) => {
                            return (
                                <button className={styles.button} onClick={action.onClick} key={index}>
                                    {renderIcon(action.title)}
                                    {action.title}
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.root__title}>{form?.title}</div>
                    <div className={styles.root__description}>{form?.description}</div>
                    <div className={styles.content}>
                        {elements?.map?.((item, index) => {
                            return renderForms(item, index);
                        })}
                    </div>
                </div>

                <Modal open={modalPreview} onClose={onCloseModalPreview} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={{ width: '100vw', height: '100vh' }}>
                        <div className={styles.modal_preview_content}>
                            <div className="form_bg" />
                            <div className={styles.modal_preview_content_title}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Preview form
                                </Typography>
                                <div className={styles.line} />
                            </div>
                            <div className={styles.modal_preview_close} onClick={onCloseModalPreview}>
                                <CloseIcon />
                            </div>
                            <div className={styles.preview_content}>
                                <PreviewForm />
                            </div>
                        </div>
                    </Box>
                </Modal>
                <Modal open={modalEdit} onClose={onCloseModalEdit} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onCloseModalEdit}>
                        <div className={styles.modal_preview_content}>
                            <div className={styles.modal_preview_content_title}>
                                <Typography className={styles.modal_edit_title} variant="h5" component="h2">
                                    Edit question
                                </Typography>
                                <div className={styles.line} />
                            </div>
                            <div className="form_bg" />
                            <div className={styles.modal_preview_close} onClick={onCloseModalEdit}>
                                <CloseIcon />
                            </div>
                            <div className={styles.element_content}>{renderElement(editingElement)}</div>
                            <div className={styles.modal_edit_row}>
                                <button className={styles.modal_edit_button} onClick={onCloseModalEdit}>
                                    Cancel
                                </button>
                                <button className={styles.modal_edit_button_save}>Save</button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

export default CreateForm;

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
