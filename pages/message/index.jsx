import styles from './Message.module.scss';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useState } from 'react';

const Message = () => {
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);
    const [email, setEmail] = useState('');
    const [listEmail, setListEmail] = useState([]);
    const [ccText, setCcText] = useState('');
    const [listEmailCc, setListEmailCc] = useState([]);
    const [bccText, setBccText] = useState('');
    const [listEmailBcc, setListEmailBcc] = useState([]);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    const onShowCc = () => {
        setCcText('');
        setShowCc(!showCc);
    };

    const onShowBcc = () => {
        setBccText('');
        setShowBcc(!showBcc);
    };

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onEmailSubmit = (e) => {
        if (e.key === 'Enter') {
            const text = email.trim();
            if (validateEmail(text)) {
                let tmp = listEmail?.length > 0 ? [...listEmail] : [];
                tmp.push(text);
                setListEmail(tmp);
                setEmail('');
            } else {
                alert('Email is wrong format');
                return;
            }
        }
    };

    const onDeleteEmail = (index) => {
        if (listEmail?.length > 0) {
            let tmp = [...listEmail];
            tmp.splice(index, 1);
            setListEmail(tmp);
        }
    };

    const onCcTextChange = (e) => {
        setCcText(e.target.value);
    };

    const onEmailCcSubmit = (e) => {
        if (e.key === 'Enter') {
            const text = ccText.trim();
            if (validateEmail(text)) {
                let tmp = listEmailCc?.length > 0 ? [...listEmailCc] : [];
                tmp.push(text);
                setListEmailCc(tmp);
                setCcText('');
            } else {
                alert('Email is wrong format');
                return;
            }
        }
    };

    const onDeleteEmailCc = (index) => {
        if (listEmailCc?.length > 0) {
            let tmp = [...listEmailCc];
            tmp.splice(index, 1);
            setListEmailCc(tmp);
        }
    };

    const onBccTextChange = (e) => {
        setBccText(e.target.value);
    };

    const onEmailBccSubmit = (e) => {
        if (e.key === 'Enter') {
            const text = bccText.trim();
            if (validateEmail(text)) {
                let tmp = listEmailBcc?.length > 0 ? [...listEmailBcc] : [];
                tmp.push(text);
                setListEmailBcc(tmp);
                setBccText('');
            } else {
                alert('Email is wrong format');
                return;
            }
        }
    };

    const onDeleteEmailBcc = (index) => {
        if (listEmailBcc?.length > 0) {
            let tmp = [...listEmailBcc];
            tmp.splice(index, 1);
            setListEmailBcc(tmp);
        }
    };

    const onChangeSubject = (e) => {
        setSubject(e.target.value);
    };

    const onChangeContent = (e) => {
        setContent(e.target.value);
    };

    const validateEmail = (mail) => {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return true;
        }
        return false;
    };

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <button className={styles.header_button}>
                    <SendOutlinedIcon />
                    Send
                </button>
                <button className={styles.header_button}>
                    <AttachFileOutlinedIcon />
                    Attach
                </button>
                <button className={styles.header_button}>
                    <DeleteOutlinedIcon />
                    Discard
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.content_row}>
                    <button className={styles.content_row_button}>To</button>
                    <div className={styles.content_row_input}>
                        <div className={styles.content_row_input_area}>
                            {listEmail?.map?.((email, index) => {
                                return (
                                    <div className={styles.content_row_input_email} key={index}>
                                        {email}
                                        <button className={styles.content_row_input_delete} onClick={() => onDeleteEmail(index)}>
                                            <CloseOutlinedIcon fontSize="small" />
                                        </button>
                                    </div>
                                );
                            })}
                            <input type="email" value={email} onChange={onEmailChange} onKeyDown={onEmailSubmit} />
                        </div>
                        {!showCc && (
                            <button onClick={onShowCc} className={styles.content_row_input_btn}>
                                Cc
                            </button>
                        )}
                        {!showBcc && (
                            <button onClick={onShowBcc} className={styles.content_row_input_btn}>
                                Bcc
                            </button>
                        )}
                    </div>
                </div>
                {showCc && (
                    <div className={styles.content_row}>
                        <button className={styles.content_row_button} onClick={onShowCc}>
                            Cc
                        </button>
                        <div className={styles.content_row_input}>
                            <div className={styles.content_row_input_area}>
                                {listEmailCc?.map?.((email, index) => {
                                    return (
                                        <div className={styles.content_row_input_email} key={index}>
                                            {email}
                                            <button className={styles.content_row_input_delete} onClick={() => onDeleteEmailCc(index)}>
                                                <CloseOutlinedIcon fontSize="small" />
                                            </button>
                                        </div>
                                    );
                                })}
                                <input type="email" value={ccText} onChange={onCcTextChange} onKeyDown={onEmailCcSubmit} />
                            </div>
                        </div>
                    </div>
                )}
                {showBcc && (
                    <div className={styles.content_row}>
                        <button className={styles.content_row_button} onClick={onShowBcc}>
                            Bcc
                        </button>
                        <div className={styles.content_row_input}>
                            <div className={styles.content_row_input_area}>
                                {listEmailBcc?.map?.((email, index) => {
                                    return (
                                        <div className={styles.content_row_input_email} key={index}>
                                            {email}
                                            <button className={styles.content_row_input_delete} onClick={() => onDeleteEmailBcc(index)}>
                                                <CloseOutlinedIcon fontSize="small" />
                                            </button>
                                        </div>
                                    );
                                })}
                                <input type="email" value={bccText} onChange={onBccTextChange} onKeyDown={onEmailBccSubmit} />
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles.content_subject}>
                    <input className={styles.content_subject_input} placeholder="Add a subject" value={subject} onChange={onChangeSubject} />
                </div>
                <div className={styles.content_detail}>
                    <textarea className={styles.content_detail_input} value={content} onChange={onChangeContent} />
                </div>
                <div className={styles.content_footer}>
                    <button className={styles.content_footer_button_send}>
                        <SendOutlinedIcon />
                        Send
                    </button>
                    <button className={styles.content_footer_button}>
                        <DeleteOutlinedIcon />
                        Discard
                    </button>
                    <button className={styles.content_footer_button_attach}>
                        <AttachFileOutlinedIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;
