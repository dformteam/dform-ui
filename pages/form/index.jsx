import React, { useState } from 'react';
import styles from './Form.module.scss';
import Image from 'next/image';
import IconTemplate from './IconTemplate.svg';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { connect } from 'react-redux';
import Notify from '../../components/Notify';

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

const Form = ({ wallet }) => {
    const [open, setOpen] = useState(false);
    const [new_form_title, setNewFormTitle] = useState('');
    const [new_form_description, setNewFormDescripton] = useState('');
    const [new_form_type, setNewFormType] = useState('card');
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenSnack(true);
        setOpenLoading(false);
        setAlertType(type);
        setSnackMsg(msg);
    };

    const router = useRouter();

    const aTemplate = [
        { id: 'blank', title: 'Blank', name: 'Create a blank form', route: '/form/create-form' },
        { id: 'demo_day', title: 'Demo day', name: `© ${new Date().getFullYear()} Learn NEAR Club`, route: '/create-form' },
    ];

    const aRecent = [
        { id: '1', title: 'Blank', subtitle: 'Create a blank form', lastUpdate: '20:00 29/12/2021' },
        { id: '2', title: 'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club', subtitle: '© 2021 Learn NEAR Club', lastUpdate: '21:00 30/12/2021' },
        { id: '1', title: 'Blank', subtitle: 'Create a blank form', lastUpdate: '20:00 29/12/2021' },
    ];

    const onCreateClick = () => {
        if (new_form_title === '' || new_form_title === null || typeof new_form_title === 'undefined') {
            return onShowResult({
                type: 'error',
                msg: 'Form title could not be empty',
            });
        }

        if (new_form_description === '' || new_form_description === null || typeof new_form_description === 'undefined') {
            return onShowResult({
                type: 'error',
                msg: 'Form description could not be empty',
            });
        }

        setOpenLoading(true);
        setOpen(false);
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        const form_type = new_form_type === 'card' ? 1 : 0;

        contract
            ?.init_new_form?.(
                {
                    title: new_form_title,
                    description: new_form_description,
                    type: form_type,
                },
                100000000000000,
            )
            .then((res) => {
                if (res) {
                    router.push(`/form/edit-form?id=${res}`);
                } else {
                    onShowResult({
                        type: 'error',
                        msg: 'Creat form failure',
                    });
                }
            })
            .catch((err) => {
                onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    const on_new_form_title_change = (e) => {
        setNewFormTitle(e.target.value);
    };

    const on_new_form_description_change = (e) => {
        setNewFormDescripton(e.target.value);
    };

    const onOpenModalCreate = () => setOpen(true);

    const onCloseModalCreate = () => setOpen(false);

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.join_form}>
                    <div className={styles.join_form_title}>Join a form now</div>
                    <div className={styles.join_form_row}>
                        <input className={styles.join_form_row_input} placeholder={'Enter your form ID here'} />
                        <button className={styles.join_form_row_button}>Join Form</button>
                    </div>
                </div>
                <div className={styles.label}>
                    <div className={styles.label_title}>Start a new form</div>
                    <div className={styles.label_text}>
                        Show all template <ChevronRightOutlinedIcon className={styles.icon_collapse} />
                    </div>
                </div>
                <div className={styles.content}>
                    {aTemplate.map((item, index) => {
                        return (
                            <div className={styles.template} key={index} onClick={() => onOpenModalCreate(item.route)}>
                                <div className={styles.template_content}>
                                    {item.id === 'blank' ? (
                                        <AddOutlinedIcon fontSize="large" className={styles.template_icon_add} />
                                    ) : (
                                        <div className={styles.template_icon}>
                                            <Image src={IconTemplate} layout="fill" alt={'Error'} priority={true} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.template_title}>{item.title}</div>
                                <div className={styles.template_name}>{item.name}</div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.label_recent}>
                    <div className={styles.label_title}>Recent</div>
                </div>
                <div className={styles.content}>
                    {aRecent.length > 0 ? (
                        <>
                            {aRecent.map((item, index) => {
                                return (
                                    <div className={styles.recent} key={index}>
                                        <div className={styles.menu}>
                                            <MoreVertOutlinedIcon fontSize="large" className={styles.recent_icon_menu} />
                                        </div>
                                        <div className={styles.recent_title}>
                                            Name: <span className={styles.recent_name}>{item.title}</span>
                                        </div>
                                        <div className={styles.recent_title}>Last updated:</div>
                                        <div className={styles.recent_last_update}>{item.lastUpdate}</div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <div className={styles.no_recent}>You don't have recent form.</div>
                    )}
                </div>
                <Modal open={open} onClose={onCloseModalCreate} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create form
                        </Typography>
                        <div className={styles.modal_row}>
                            <div className={styles.modal_label}>Name</div>
                            <input value={new_form_title} className={styles.modal_input} onChange={on_new_form_title_change} />
                        </div>
                        <div className={styles.modal_row}>
                            <div className={styles.modal_label}>Description</div>
                            <input value={new_form_description} className={styles.modal_input} onChange={on_new_form_description_change} />
                        </div>
                        <div className={styles.modal_row}>
                            <div className={styles.modal_label}>Form type</div>
                            <button
                                className={new_form_type === 'card' ? styles.modal_button_active : styles.modal_button}
                                onClick={() => setNewFormType('card')}
                            >
                                Card Form
                            </button>
                            <button
                                className={(new_form_type === 'basic' ? styles.modal_button_active : styles.modal_button) + ' ' + styles.margin_left}
                                onClick={() => setNewFormType('basic')}
                            >
                                Basic Form
                            </button>
                        </div>
                        <div className={styles.modal_row_button}>
                            <button className={styles.modal_button_cancel} onClick={() => setOpen(false)}>
                                Cancel
                            </button>
                            <button className={styles.modal_create_button} onClick={onCreateClick}>
                                Create form
                            </button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(Form);
