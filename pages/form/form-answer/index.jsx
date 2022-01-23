/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from 'react';
import styles from './FormAnswer.module.scss';
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
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadIcon from '@mui/icons-material/Upload';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const FormAnswer = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const { query } = router;
    let raws = [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [form_type, setType] = useState('basi');
    const [form, setForm] = useState({});
    const [elements, setElements] = useState([]);
    const [total_element, setTotalElement] = useState([]);

    useLayoutEffect(() => {
        onGetFormDetail();
    }, []);

    useLayoutEffect(() => {
        getParticipantFormDetail();
    }, [form]);

    useLayoutEffect(() => {
        if (form?.elements?.length === elements?.length) {
            setTotalElement([
                {
                    id: 'welcome',
                    type: 2,
                    label: 'Welcome',
                    defaultValue: {
                        title: ['Welcome', 'Please fill out and submit this form.'],
                        meta: [],
                        isRequired: false,
                    },
                },
                ...(elements || []),
                // {
                //     id: 'thanks',
                //     type: 2,
                //     label: 'Thanks',
                //     defaultValue: {
                //         title: ['Thank You!', 'Your submission has been received.'],
                //         meta: [],
                //         isRequired: false,
                //     },
                // },
            ]);
        }
    }, [elements]);

    const onGetFormDetail = () => {
        const { contract } = wallet;
        const { id } = query;

        if (id === null || id === '' || typeof id === 'undefined') {
            return redirectError('Could not found any object have that id!');
        }

        contract
            ?.get_form?.({
                id,
            })
            .then((res) => {
                if (res) {
                    const { start_date, end_date, status } = res;
                    const content = '';
                    const currentTimestamp = Date.now();
                    if (status === 0) {
                        return redirectError('This form has not been published!');
                    } else if (currentTimestamp > end_date) {
                        return redirectError('This form has been ended');
                    } else if (currentTimestamp < start_date) {
                        return redirectError('This form has not been started');
                    }

                    if (content !== '') {
                        return redirectError(content);
                    }
                    console.log(res);
                    setForm(res);
                    setType(res.type === 0 ? 'basic' : 'card');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getParticipantFormDetail = () => {
        const { contract, walletConnection } = wallet;
        const { id } = query;
        const userId = walletConnection.getAccountId();

        if (id === null || id === '' || typeof id === 'undefined') {
            return redirectError('Could not found any object have that id!');
        }

        contract
            ?.get_participant_form_status?.({
                userId,
                formId: id,
            })
            .then((res) => {
                if (res) {
                    if (!res.joined) {
                        router.push(`/form/join-form?id=${id}`);
                    }

                    onGetMaxElement();
                } else {
                    router.push(`/form/join-form?id=${id}`);
                }
            })
            .catch((err) => {
                console.log(err);
                router.push(`/form/join-form?id=${id}`);
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
            return contract
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
                            let temp_elements = [];
                            raws.map((raw) => {
                                const transform_form = raw?.data?.map((form_data) => {
                                    return {
                                        bId: form_data.id,
                                        id: listElement?.[form_data.type]?.id,
                                        type: form_data.type,
                                        label: listElement?.[form_data.type]?.label,
                                        defaultValue: {
                                            title: form_data?.title,
                                            meta: form_data?.meta,
                                            isRequire: form_data?.isRequired,
                                        },
                                    };
                                });
                                temp_elements = [...temp_elements, ...(transform_form || [])];
                                return temp_elements;
                            });

                            setElements([...temp_elements]);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    };

    const redirectError = (content) => {
        const encoded_content = encodeURIComponent(content);
        router.push(`/error?content=${encoded_content}`);
    };

    const renderElement = (el, index) => {
        const { type, id, defaultValue } = el;

        switch (id) {
            case 'welcome':
                return renderWelcome(el);
            case 'thanks':
                return renderThanks(el);
            case 'header':
                return <Header />;
            case 'fullName':
                return <FullName index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'email':
                return <Email index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'address':
                return <Address index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'phone':
                return <Phone index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'datePicker':
                return <DatePicker index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'shortText':
                return <ShortText index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'longText':
                return <LongText index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'time':
                return <Time index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'rating':
                return <StarRating index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'singleChoice':
                return <SingleChoice index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            case 'multiChoice':
                return <MultiChoice index={index} onChange={onElementChanged} elType={type} type={'answer'} defaultValue={defaultValue} />;
            // case 'fillBlank':
            //     return <FillBlank index={index} elType={type} type={'answer'} defaultValue={defaultValue} />;

            default:
                break;
        }
    };

    const renderWelcome = (el) => {
        const { defaultValue } = el;
        return (
            <>
                <div className={styles.welcome_title}>{defaultValue.title[0]}</div>
                <div className={styles.welcome_text}>{defaultValue.title[1]}</div>
                <div className={styles.welcome_button} onClick={onNextClick}>
                    Start <ArrowForwardOutlinedIcon className={styles.icon_next} />
                </div>
            </>
        );
    };

    const renderThanks = (el) => {
        const { defaultValue } = el;
        return (
            <>
                <CheckCircleIcon className={styles.success_icon} />
                <div className={styles.welcome_title}>{defaultValue.title[0]}</div>
                <div className={styles.welcome_text}>{defaultValue.title[1]}</div>
                <div className={styles.goto_homepage}>Go to homepage</div>
            </>
        );
    };

    const onNextClick = () => {
        setActiveIndex(activeIndex + 1 > total_element.length - 1 ? total_element.length - 1 : activeIndex + 1);
        console.log(activeIndex, elements.length);
        if (activeIndex === elements.length - 1) {
            setType('basic');
        }
    };

    const onPrevClick = () => {
        setActiveIndex(activeIndex - 1 > 0 ? activeIndex - 1 : 0);
    };

    const onElementChanged = ({ index, title, meta, isRequired }) => {
        console.log({ index, title, meta, isRequired });
        total_element[index] = {
            ...total_element[index],
            defaultValue: {
                title,
                meta,
                isRequired,
            },
        };

        setElements([...total_element]);
    };

    const renderBasicForm = () => {
        return (
            <>
                {total_element.map((item, index, total) => {
                    return (
                        <div className={styles.element_content} key={index}>
                            {renderElement(item, index)}
                            {index + 1 === total.length && (
                                <div className={styles.button_submit} style={{ borderBottomLeftRadius: 24, justifyContent: 'center' }} onClick={onNextClick}>
                                    <UploadIcon className={styles.icon_next} /> {' Submit'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </>
        );
    };

    const renderCardForm = () => {
        return (
            <>
                {total_element.map((item, index) => {
                    if (index !== activeIndex) {
                        return null;
                    }

                    return (
                        <div className={styles.element_content} key={index}>
                            {renderElement(item, index)}
                            {renderQuestionNavigate(item, index)}
                        </div>
                    );
                })}
                {total_element.length > 0 && <div className={styles.number_element}>{activeIndex + 1 + ' / ' + total_element.length}</div>}
            </>
        );
    };

    const renderQuestionNavigate = (item, index) => {
        return (
            <>
                {item.id !== 'welcome' && item.id !== 'thanks' && (
                    <div className={styles.button_submit}>
                        {index > 1 && (
                            <div className={styles.button_prev} onClick={onPrevClick}>
                                <ArrowBackOutlinedIcon className={styles.icon_prev} />
                                Previous
                            </div>
                        )}
                        <div
                            className={styles.button_next}
                            style={index === 1 ? { borderBottomLeftRadius: 24, justifyContent: 'center' } : null}
                            onClick={onNextClick}
                        >
                            {index < total_element.length - 1 ? 'Next' : 'Review you answer'} <ArrowForwardOutlinedIcon className={styles.icon_next} />
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.form_title}>Form Title</div>
                {form_type === 'basic' ? renderBasicForm() : renderCardForm()}
            </div>
        </div>
    );
};

export default FormAnswer;

const listElement = [
    {
        bId: '',
        id: 'header',
        type: 0,
        label: 'Header',
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
        defaultValue: {
            title: ['Date Picker', 'Please pick a date.'],
            meta: [],
            isRequired: false,
        },
    },
    // {
    //     bId: '',
    //     id: 'fillBlank',
    //     type: 6,
    //     label: 'Fill in the Blank',
    //     defaultValue: {
    //         title: ['Type a question'],
    //         meta: [],
    //         isRequired: false,
    //     },
    // },
    {
        bId: '',
        id: 'shortText',
        type: 7,
        label: 'Shot Text',
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
        defaultValue: {
            title: ['Type a question'],
            meta: [],
            isRequired: false,
        },
    },
];
