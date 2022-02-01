/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Notify from '../../../components/Notify';
import { utils } from 'near-api-js';

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
    const router = useRouter();
    const [status, setStatus] = useState('private');
    const [focus, setFocus] = useState(false);
    const [open, setOpen] = useState(false);
    const [free, setFree] = useState(true);
    const [black_list, setBlackList] = useState([]);
    const [white_list, setWhiteList] = useState([]);
    const [sharedLink, setSharedLink] = useState('');
    const [black_account, setBlackAccount] = useState('');
    const [white_account, setWhiteAccount] = useState('');

    const aStatus = [
        { id: 'private', title: 'PRIVATE FORM', sub: 'Only available to invited people' },
        { id: 'public', title: 'PUBLIC FORM', sub: 'Available to everyone' },
        // { id: 'share', title: 'SHARE FORM AS A TEMPLATE', sub: 'Share your form as a template ' },
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

    const onCloseInputEmail = () => {
        setFocus(false);
    };

    const onInputEmailFocus = () => {
        setFocus(true);
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

    const onDeleteBlackItem = (chipToDelete) => {
        setBlackList([...black_list.filter((chip) => chip !== chipToDelete)]);
    };

    const onDeleteWhiteItem = (chipToDelete) => {
        setWhiteList([...white_list.filter((chip) => chip !== chipToDelete)]);
    };

    const renderActiveStatus = (id) => {
        if (status === id) {
            let tmp = 'publish_status_content_active_' + id;
            return styles[tmp];
        }
    };

    const ListItem = styled('div')(({ theme }) => ({
        margin: theme.spacing(1),
    }));

    return (
        <div className={styles.root}>
            <div className={styles.publish_content}>
                <div className={styles.publish_title}>
                    <div className={styles.publish_title_text}>Publish Form</div>
                    <div className={styles.publish_title_status}>{renderStatus()}</div>
                    {sharedLink === '' && (
                        <div className={styles.publish_button_area}>
                            <button className={styles.publish_button}>Publish</button>
                        </div>
                    )}
                    {sharedLink !== '' && (
                        <div className={styles.publish_button_area}>
                            <button className={styles.publish_button}>Go back</button>
                        </div>
                    )}
                </div>
                <div className={styles.line} />
                {sharedLink !== '' && (
                    <>
                        <div className={styles.publish_share_label}>Link to share:</div>
                        <div className={styles.publish_row}>
                            <LinkOutlinedIcon className={styles.publish_icon_link} />
                            <div className={styles.publish_link_input}>{sharedLink}</div>
                            <div className={styles.publish_link_copy}>Copy link</div>
                        </div>
                    </>
                )}
                {aStatus.map((item, index) => {
                    return (
                        <div className={styles.publish_status_content + ' ' + renderActiveStatus(item.id)} onClick={() => onStatusItemClick(item)} key={index}>
                            <div className={styles.publish_status_title}>{item.title}</div>
                            <div className={styles.publish_status_sub}>{item.sub}</div>
                            {status === item.id && <CheckCircleIcon className={styles.publish_icon_check} />}
                        </div>
                    );
                })}
                <div className={styles.publish_row_input} style={{ height: status === 'private' ? 64 : 0 }}>
                    <input className={styles.publish_black_input} placeholder={'Enter black list'} />
                    <div className={styles.publish_black_button}>Add to Black List</div>
                    <input className={styles.publish_black_input} placeholder={'Enter white list'} />
                    <div className={styles.publish_white_button}>Add to White List</div>
                </div>
                <div className={styles.publish_fee_row + ' ' + styles.margin_top}>
                    <div className={styles.publish_fee_label}>Limit participant</div>
                    <input className={styles.publish_fee_input} type={'number'} placeholder={`Leave blank if you don't want to the limitation`} />
                </div>
                <div className={styles.publish_fee_row}>
                    <div className={styles.publish_fee_label}>Joining Fee</div>
                    <button className={free ? styles.publish_fee_button_active : styles.publish_fee_button} onClick={() => setFree(true)}>
                        Free
                    </button>
                    <button className={!free ? styles.publish_fee_button_active : styles.publish_fee_button} onClick={() => setFree(false)}>
                        Paid
                    </button>
                    {!free && <input className={styles.publish_fee_input} type={'number'} placeholder={'The amount need to be paid by a participant'} />}
                </div>
                <div className={styles.publish_fee_row}>
                    <div className={styles.publish_fee_label}>Starting time</div>
                    <input className={styles.publish_fee_input_date} type={'datetime-local'} />
                    <div className={styles.publish_fee_label_paid}>Ending time</div>
                    <input className={styles.publish_fee_input_date} type={'datetime-local'} />
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
            {status === 'private' && (
                <div className={styles.list}>
                    <div className={styles.list_label}>Black list:</div>
                    <div className={styles.list_content}>
                        {black_list?.length > 0 ? (
                            <>
                                {black_list.map((data) => {
                                    return (
                                        <ListItem key={data}>
                                            <Chip label={data} onDelete={() => onDeleteBlackItem(data)} variant="outlined" color="error" />
                                        </ListItem>
                                    );
                                })}
                            </>
                        ) : (
                            <div className={styles.list_nothing}>Nothing to display</div>
                        )}
                    </div>
                    <div className={styles.list_label}>White list:</div>
                    <div className={styles.list_content}>
                        {white_list?.length > 0 ? (
                            <>
                                {white_list.map((data) => {
                                    return (
                                        <ListItem key={data}>
                                            <Chip label={data} onDelete={() => onDeleteWhiteItem(data)} variant="outlined" color="success" />
                                        </ListItem>
                                    );
                                })}
                            </>
                        ) : (
                            <div className={styles.list_nothing}>Nothing to display</div>
                        )}
                    </div>
                </div>
            )}

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
