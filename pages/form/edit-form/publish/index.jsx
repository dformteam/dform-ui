import React, { useState } from 'react';
import styles from './Publish.module.scss';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    bgcolor: '#fff',
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

const Publish = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const query = { router };
    const [status, setStatus] = useState('private');
    const [focus, setFocus] = useState(false);
    const [open, setOpen] = useState(false);
    const [free, setFree] = useState(true);
    const [fee, setFee] = useState('0');
    const [participant, setParticipant] = useState(0);
    const [black_list, setBlackList] = useState([]);
    const [white_list, setWhiteList] = useState([]);
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');

    const aStatus = [
        { id: 'private', title: 'PRIVATE FORM', sub: 'Only available to invited people' },
        { id: 'public', title: 'PUBLIC FORM', sub: 'Available to everyone' },
        { id: 'share', title: 'SHARE FORM AS A TEMPLATE', sub: 'Share your form as a template ' },
    ];

    const onStatusItemClick = (item) => {
        setStatus(item.id);
        if (item.id === 'share') {
            setOpen(true);
        }
    };

    const onCloseModalShare = () => {
        setOpen(false);
    };

    const onInputEmailFocus = () => {
        setFocus(true);
    };

    const onCloseInputEmail = () => {
        setFocus(false);
    };

    const onFeeChange = (e) => {
        setFee(e.target.value);
    };

    const onStartingDateChange = (e) => {
        const date = new Date(e.target.value);
        setStartDate(date.getTime().toString());
    };

    const onEndingDateChange = (e) => {
        const date = new Date(e.target.value);
        setEndDate(date.getTime().toString());
    };

    const onBlackListChang = (e) => {
        setBlackList(e.target.value);
    };

    const onWhiteListChange = (e) => {
        setWhiteList(e.target.value);
    };

    const onPublishForm = () => {
        const { contract } = wallet;
        let isDuplicate = false;
        const black_lists = black_list?.split(',')?.map((x) => x?.trim?.()) || [];
        const white_lists = white_list?.split(',')?.map((x) => x?.trim()) || [];
        const black_list_set = new Set(black_lists);
        black_list_set.forEach((item) => {
            if (white_list_set.has(item)) {
                isDuplicate = true;
            }
        });

        const white_list_set = new Set(white_lists);
        const id = { query };

        if (isDuplicate) {
            //Show error
            return;
        }

        contract
            ?.publish_form?.({
                form_id: id,
                limit_participants: participant,
                enroll_fee: fee,
                start_date,
                end_date,
                black_list: black_list_set.values(),
                white_list: white_list_set.values(),
            })
            .then((res) => {
                if (res) {
                    console.log(res);
                    // router.push(`/form/create-form?id=${res}`);
                }
            })
            .catch((err) => {});
    };

    const renderStatus = () => {
        switch (status) {
            case 'private':
                return (
                    <div className={styles.publish_title_button}>
                        <LockOutlinedIcon className={styles.icon_lock} />
                        Private Form
                    </div>
                );
            case 'public':
                return (
                    <div className={styles.publish_title_button_public}>
                        <LockOpenOutlinedIcon className={styles.icon_lock} />
                        Public Form
                    </div>
                );
            case 'share':
                return (
                    <div className={styles.publish_title_button_share}>
                        <ShareOutlinedIcon className={styles.icon_lock} />
                        SHARE FORM AS A TEMPLATE
                    </div>
                );

            default:
                break;
        }
    };

    const renderActiveStatus = (id) => {
        if (status === id) {
            let tmp = 'publish_status_content_active_' + id;
            return styles[tmp];
        }
    };

    const onParticipantChange = () => {};

    return (
        <div className={styles.root}>
            <div className={styles.publish_content}>
                <div className={styles.publish_title}>
                    <div className={styles.publish_title_text}>Link to share</div>
                    <div className={styles.publish_title_status}>{renderStatus()}</div>
                </div>
                <div className={styles.publish_row}>
                    <LinkOutlinedIcon className={styles.publish_icon_link} />
                    <div className={styles.publish_link_input}></div>
                    <div className={styles.publish_link_copy}>Copy link</div>
                </div>
                {aStatus.map((item, index) => {
                    return (
                        <div className={styles.publish_status_content + ' ' + renderActiveStatus(item.id)} onClick={() => onStatusItemClick(item)} key={index}>
                            <div className={styles.publish_status_title}>{item.title}</div>
                            <div className={styles.publish_status_sub}>{item.sub}</div>
                            {status === item.id && <CheckCircleIcon className={styles.publish_icon_check} />}
                        </div>
                    );
                })}
                <div className={styles.publish_fee_row + ' ' + styles.margin_top}>
                    <div className={styles.publish_fee_label}>Limit participant</div>
                    <input
                        className={styles.publish_fee_input}
                        type={'number'}
                        onChange={onParticipantChange}
                        placeholder={`Leave blank if you don't want to the limitation`}
                    />
                </div>
                <div className={styles.publish_fee_row}>
                    <div className={styles.publish_fee_label}>Joining Fee</div>
                    <button className={free ? styles.publish_fee_button_active : styles.publish_fee_button} onClick={() => setFree(!free)}>
                        Free
                    </button>
                    {!free && (
                        <>
                            <div className={styles.publish_fee_label_paid}>Paid</div>
                            <input
                                className={styles.publish_fee_input}
                                type={'number'}
                                onChange={onFeeChange}
                                placeholder={'The amount need to be paid by a participant'}
                            />
                        </>
                    )}
                </div>
                <div className={styles.publish_fee_row}>
                    <div className={styles.publish_fee_label}>Starting time</div>
                    <input className={styles.publish_fee_input_date} type={'datetime-local'} onChange={onStartingDateChange} />
                    <div className={styles.publish_fee_label_paid}>Ending time</div>
                    <input className={styles.publish_fee_input_date} type={'datetime-local'} onChange={onEndingDateChange} />
                </div>
                <div className={styles.publish_invite}>INVITE BY NEAR ACCOUNT</div>
                <div className={styles.publish_invite_content}>
                    <EmailOutlinedIcon className={styles.publish_invite_email_icon} />
                    <div className={styles.publish_invite_label}>To:</div>
                    <input className={styles.publish_invite_input} placeholder={'Enter Near account to send invitation'} onFocus={onInputEmailFocus} />
                </div>
                <div className={styles.publish_invite_onfocus} style={{ height: focus ? 225 : 0 }}>
                    <textarea className={styles.publish_invite_message} rows={5} placeholder={'Add an invitation message'} />
                    <div className={styles.publish_invite_row_button}>
                        <button className={styles.publish_invite_button} onClick={onCloseInputEmail}>
                            Cancel
                        </button>
                        <button className={styles.publish_invite_button_send}>Send invitation</button>
                    </div>
                </div>
            </div>
            <Modal open={open} onClose={onCloseModalShare} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Share form as template
                    </Typography>
                    <div className={styles.publish_modal_content}>
                        <div className={styles.publish_modal_row}>
                            <div className={styles.publish_modal_label}>Template Title</div>
                            <input className={styles.publish_modal_input} placeholder={'Enter title here'} />
                        </div>
                        <div className={styles.publish_modal_row}>
                            <div className={styles.publish_modal_label}>Description</div>
                            <textarea className={styles.publish_modal_textarea} rows={5} placeholder={'Enter description here'} />
                        </div>
                        <div className={styles.publish_invite_row_button}>
                            <button className={styles.publish_modal_button} onClick={onCloseModalShare}>
                                Cancel
                            </button>
                            <button className={styles.publish_modal_button_share}>Share</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default Publish;