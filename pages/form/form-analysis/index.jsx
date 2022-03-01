/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import styles from './FormAnalysis.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Notify from '../../../components/Notify';
import { Web3Storage } from 'web3.storage';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 800,
    bgcolor: '#efefef',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    maxHeight: 'calc(100vh - 50px)',
    overflow: 'auto',
};

const FormAnalysis = () => {
    let raw_answers = [];

    const wallet = useSelector((state) => state.wallet);
    const { walletConnection } = wallet;
    const userId = walletConnection.getAccountId();
    const router = useRouter();
    const { query } = router;
    const w3Client = new Web3Storage({ token: process.env.NEXT_PUBLIC_w3key });

    const [intervalId, setIntervalId] = useState(-1);

    const [form, setForm] = useState({});
    const [participant, setParticipant] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [cParticipant, setCurrentParticipant] = useState('');
    const [notify, setNotify] = useState('Choose a participant to see the answer');
    const [cStauts, setCurrentStatus] = useState('Loading...');
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [raws, setRaws] = useState({});
    const [headerTables, setHeaderTables] = useState([]);
    const [answerTables, setAnswerTables] = useState([]);

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenSnack(true);
        setOpenLoading(false);
        setAlertType(type);
        setSnackMsg(msg);
    };

    useEffect(() => {
        onGetFormDetail();

        const id = setInterval(() => {
            onGetFormDetail();
        }, 30000);

        setIntervalId(id);
    }, []);

    useEffect(() => {
        return () => {
            if (intervalId !== -1) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    useEffect(() => {
        if (typeof form.rootId !== 'undefined' && form.rootId !== null && form.rootId !== '') {
            onRetrieveAnswer(form.rootId);
        }
    }, [form]);

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
                    const { start_date, participants, status } = res;
                    const content = '';
                    const currentTimestamp = Date.now().toString();
                    if (status === 0) {
                        return redirectError('This form has not been published!');
                    } else if (currentTimestamp < start_date) {
                        return redirectError('This form has not been started');
                    }

                    if (content !== '') {
                        const encoded_content = encodeURIComponent(content);
                        router.push(`/error?content=${encoded_content}`);
                    }

                    setForm(res);
                    const prt = participants?.map((pt) => {
                        return {
                            name: pt,
                            checked: false,
                        };
                    });
                    setParticipant([...prt]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onParticipantDetailClicked = (item, index) => {
        setAnswers([]);
        participant[index].checked = true;
        if (userId !== form.owner && userId !== item) {
            setCurrentParticipant('');
            return setNotify('You only see your answers!');
        }

        setParticipant([...participant]);
        setCurrentParticipant(item);
        getMaxAnswers(item);
    };

    const getMaxAnswers = (part) => {
        setOpenLoading(true);
        const { contract } = wallet;
        const { id } = query;
        contract
            ?.get_passed_element_count?.({
                formId: id,
                userId: part,
            })
            .then((res) => {
                if (res) {
                    getAnswers(part, res);
                } else {
                    setCurrentStatus('Nothing to be shown');
                    setOpenLoading(false);
                }
            })
            .catch((err) => {
                onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    const getAnswers = async (part, total) => {
        if (typeof raws[part] !== 'undefined' && raws[part].length === total) {
            setOpenLoading(false);
            return setAnswers([...raws[part]]);
        }
        const { contract } = wallet;
        const { id } = query;
        const num_page = total % 5 === 0 ? parseInt(total / 5) : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        setAnswers([]);
        raw_answers = [];
        let tmp_answers = [];
        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_answer_statistical(
                        {
                            userId: part,
                            formId: id,
                            page: index + 1,
                        },
                        50000000000000,
                    )
                    .then((datax) => {
                        if (datax) {
                            const pIndex = raw_answers.findIndex((x) => x?.page === datax?.page);
                            if (pIndex === -1) {
                                raw_answers.push(datax);
                                raw_answers.sort((a, b) => {
                                    if (a.page < b.page) return -1;
                                    if (a.page > b.page) return 1;
                                    return 0;
                                });
                                tmp_answers = [];
                                raw_answers.map((raw) => {
                                    const transform_form = raw?.data?.map((form_data) => {
                                        const tmp_data = {
                                            bId: form_data.element_id,
                                            id: listElement?.[form_data.type]?.id,
                                            type: form_data.type,
                                            label: listElement?.[form_data.type]?.label,
                                            defaultValue: {
                                                title: form_data?.title,
                                                isRequire: form_data?.isRequired,
                                                meta: form_data?.answer,
                                            },
                                            numth: form_data.numth,
                                        };

                                        if (tmp_data.id === 'singleChoice' || tmp_data.id === 'multiChoice') {
                                            tmp_data.defaultValue.meta = form_data?.meta?.map((x) => {
                                                return {
                                                    content: x,
                                                    check: form_data?.answer?.includes(x) ? true : false,
                                                };
                                            });
                                        }
                                        return tmp_data;
                                    });
                                    tmp_answers = [...tmp_answers, ...(transform_form || [])];
                                    return '';
                                });

                                tmp_answers = tmp_answers?.sort((x, y) => {
                                    if (x?.numth < y?.numth) return -1;
                                    if (x?.numth > y?.numth) return 1;
                                    return 0;
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }),
        )
            .then(() => {
                raws[part] = [...tmp_answers];
                setRaws({
                    ...raws,
                });
                setAnswers([...tmp_answers]);
                setOpenLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setOpenLoading(false);
            });
    };

    const onRetrieveAnswer = async (cId) => {
        const res = await w3Client.get(cId);
        if (res.ok) {
            const files = await res.files();
            let reader = new FileReader();
            reader.onload = (e) => {
                onMakeResult(JSON.parse(e.target.result));
            };
            reader.readAsText(files[0], 'utf-8');
        }
    };

    const onMakeResult = (results) => {
        const tmp_header = ['participant', 'Submissions date'];
        if (results?.length > 0) {
            const ret = results?.[0];
            const { element } = ret;
            element?.map?.((el) => {
                tmp_header.push(el?.defaultValue?.title?.[0]);
                return el;
            });
        }

        const tmp_answer = [];

        results?.map?.((ret) => {
            let tmp_ret = {};
            const { element } = ret;
            tmp_ret['participant'] = ret?.participant?.id;
            tmp_ret['submit'] = ret?.participant?.submited_timestamp;
            tmp_ret['anws'] = [];
            if (userId === ret?.participant?.id || form.owner === userId) {
                element?.map?.((el, index) => {
                    if (el.id === 'multiChoice' || el.id === 'singleChoice') {
                        const meta = el?.defaultValue?.meta
                            ?.filter((x) => x.check)
                            ?.map((x) => x.content)
                            ?.join(',');
                        tmp_ret?.anws?.push(meta);
                    } else {
                        tmp_ret?.anws?.push(el?.defaultValue?.meta?.join(','));
                    }
                    return el;
                });
            }

            tmp_answer.push(tmp_ret);
            return ret;
        });

        setHeaderTables([...tmp_header]);
        setAnswerTables([...tmp_answer]);
    };

    const onRandomColorBg = () => {
        return color[Math.floor(Math.random() * 5)];
    };

    const onCloseModal = () => {
        setOpenModal(false);
    };

    const redirectError = (content) => {
        const encoded_content = encodeURIComponent(content);
        router.push(`/error?content=${encoded_content}`);
    };

    const renderElement = (el, index) => {
        const { type, id, defaultValue } = el;
        switch (id) {
            case 'header':
                return <Header />;
            case 'fullName':
                return <FullName index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'email':
                return <Email index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'address':
                return <Address index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'phone':
                return <Phone index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'datePicker':
                return <DatePicker index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'shortText':
                return <ShortText index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'longText':
                return <LongText index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'time':
                return <Time index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'rating':
                return <StarRating index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'singleChoice':
                return <SingleChoice index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            case 'multiChoice':
                return <MultiChoice index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;
            // case 'fillBlank':
            //     return <FillBlank index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;

            default:
                break;
        }
    };

    const renderAnswer = () => {
        if (answers?.length === 0) {
            return <div className={styles.cStatus}>{cStauts}</div>;
        } else {
            return answers?.map?.((item, index) => {
                return (
                    <div className={styles.element_content} key={index}>
                        {renderElement(item, index)}
                    </div>
                );
            });
        }
    };

    const onRenderParticipant = (item, index) => {
        const { name } = item;
        const shortName = `${name?.[0]}${name?.[1]}`;
        return (
            <div
                className={styles.participant_area}
                key={index}
                // onClick={() => onParticipantDetailClicked(name, index)}
            >
                <div className={styles.participant_area_avata} style={{ background: onRandomColorBg() }}>
                    {shortName}
                </div>
                <div
                    className={styles.participant_area_name}
                    style={{
                        color: item.checked ? 'var(--color-secondary)' : '',
                    }}
                >
                    {name}
                </div>
            </div>
        );
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.content}>
                    <div className={styles.content_left}>
                        <div className={styles.form_analysis_title}>{form?.title}</div>
                        <div className={styles.form_analysis_text}>Total Question(s): {form?.elements?.length}</div>
                        <div className={styles.form_analysis_text}>Total Participant(s): {form?.participants?.length}</div>
                        {participant?.length > 0 ? (
                            <div className={styles.participant_root}>
                                <div className={styles.participant_list}>
                                    {participant.map((item, index) => {
                                        return onRenderParticipant(item, index);
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.participant_nothing}>
                                <div className={styles.nothing_text}>Nothing to display</div>
                            </div>
                        )}
                    </div>
                    {/* {cParticipant !== '' && (
                        <div className={styles.participant_preview}>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Result of: <span style={{ color: 'var(--color-link)' }}>{cParticipant}</span>
                            </Typography>

                            <div className={styles.line}></div>
                            <div className={styles.modal_content}>{renderAnswer()}</div>
                            <div class={styles.modal_content}>
                                <Analysis headers={headerTables} content={answerTables} />
                            </div>
                        </div>
                    )} */}
                    <div className={styles.modal_content}>
                        <Analysis formName={form?.title} headers={headerTables} content={answerTables} />
                    </div>
                    {/* {cParticipant === '' && <div className={styles.participant_notify}>{notify}</div>} */}
                </div>

                <Modal open={openModal} onClose={onCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}></Box>
                </Modal>
            </div>
        </>
    );
};

export default FormAnalysis;

const Analysis = ({ formName, headers, content }) => {
    // const headers = ['Participant', 'Submissions date', 'Type', 'Created at', 'status'];
    const [header, setHeader] = useState(headers);
    const [rows, setRows] = useState(content);

    useEffect(() => {
        setHeader(headers);
        setRows(
            content.sort((a, b) => {
                return (a?.submit || 0) - (b?.submit || 0);
            }),
        );
    }, [headers, content]);

    const onExportDate = (value) => {
        const date = new Date(value);
        let day = date.getDate();
        day = day < 10 ? `0${day}` : day;
        let month = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        let year = date.getFullYear();
        let hours = date.getHours();
        hours = hours < 10 ? `0${hours}` : hours;
        let min = date.getMinutes();
        min = min < 10 ? `0${min}` : min;
        let sec = date.getSeconds();
        sec = sec < 10 ? `0${sec}` : sec;

        return `${month}/${day}/${year} - ${hours}:${min}:${sec}`;
    };

    const onExportClicked = () => {
        const result = [];
        const count = {};
        rows?.map?.((row) => {
            const tmp = {};
            tmp['pariticipant'] = row.participant;
            tmp['submit time'] = onExportDate(row.submit);

            row?.anws?.map?.((anw, index) => {
                let key = headers?.[index + 2];
                if (key in tmp) {
                    let c = count?.[key] || 0;
                    count[key] = c + 1;
                    key = `${key} (${c + 1})`;
                }
                tmp[key] = anw;
                return anw;
            });

            result.push(tmp);
            return row;
        });

        const replacer = (key, value) => (value === null ? '' : value);
        const headerx = Object.keys(result[0]);
        const csv = [headerx.join(','), ...result.map((row) => headerx.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','))].join('\r\n');

        const fileName = `${formName?.split(' ')?.join?.('_') || ''}_result.csv`;
        var data = new Blob([csv], { type: 'application/vnd.ms-excel' });
        var link = document.createElement('a');
        link.setAttribute('download', fileName);
        link.href = URL.createObjectURL(data);
        link.click();
    };

    return (
        <div className={styles.table_root}>
            <button className={styles.export} onClick={onExportClicked}>
                Export
            </button>
            <div className={styles.table_content}>
                <div className={styles.table}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {header?.map?.((hd, index) => (
                                    <TableCell align="left" key={index} className={styles.table_title}>
                                        {hd.toUpperCase()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.map?.((item, index) => (
                                <TableRow
                                    key={index}
                                    style={{
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                    }}
                                >
                                    <TableCell className={styles.cell_title}>{item.participant}</TableCell>
                                    <TableCell className={styles.cell}>{onExportDate(item.submit)}</TableCell>
                                    {item?.anws?.map?.((anw, indexx) => {
                                        return (
                                            <TableCell className={styles.cell} key={indexx}>
                                                {anw}
                                            </TableCell>
                                        );
                                    })}
                                    {/* <TableCell className={styles.cell}>{item?.[`anw_${index - 2}`]}</TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

const color = [
    'linear-gradient(135deg, #007AFF, #23D2FF)',
    'linear-gradient(135deg, #FFD3A5, #FD6585)',
    'linear-gradient(135deg, #FC3B63, #711DDF)',
    'linear-gradient(135deg, #69F9CC, #F8B0AD, #F6E884)',
    'linear-gradient(135deg, #EE9AB1, #FCFF00)',
    'linear-gradient(135deg, #EE9AE5, #5961F9)',
    '#FFD166',
    '#FA8F54',
];

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
            error: '',
        },
    },
    {
        bId: '',
        id: 'fullName',
        type: 1,
        label: 'Full Name',
        defaultValue: {
            title: ['Name', 'Type your description', 'First Name', 'Last Name'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'email',
        type: 2,
        label: 'Email',
        defaultValue: {
            title: ['Email', 'Type your description', 'Email.'],
            meta: [],
            isRequired: false,
            error: '',
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
            error: '',
        },
    },
    {
        bId: '',
        id: 'phone',
        type: 4,
        label: 'Phone',
        defaultValue: {
            title: ['Phone Number', 'Type your description', 'Please enter a valid phone number.'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'datePicker',
        type: 5,
        label: 'Date Picker',
        defaultValue: {
            title: ['Date Picker', 'Type your description', 'Please pick a date.'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'fillBlank',
        type: 6,
        label: 'Fill in the Blank',
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
        defaultValue: {
            title: ['Type a question', 'Type your description'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'longText',
        type: 8,
        label: 'Long text',
        defaultValue: {
            title: ['Type a question', 'Type your description'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'singleChoice',
        type: 9,
        label: 'Single Choice',
        defaultValue: {
            title: ['Type a question', 'Type your description'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'multiChoice',
        type: 10,
        label: 'Multi Choice',
        defaultValue: {
            title: ['Type a question', 'Type your description'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'time',
        type: 11,
        label: 'Time',
        defaultValue: {
            title: ['Type a question', 'Type your description'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
    {
        bId: '',
        id: 'rating',
        type: 12,
        label: 'Rating',
        defaultValue: {
            title: ['Type a question', 'Type your description'],
            meta: [],
            isRequired: false,
            error: '',
        },
    },
];
