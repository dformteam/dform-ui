import { useState } from 'react';
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
import FillBlank from '../../../components/Elements/FillBlank';

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
    const data = {
        title: 'Demo Form',
        total: 13,
        q_participant: 10,
        a_participant: [
            { id: 'annhd.near' },
            { id: 'fdssfd.near' },
            { id: 'xcvxxc.near' },
            { id: 'tyuiyt.near' },
            { id: 'uiuyiouioyu.near' },
            { id: 'ghjbnmnbm,.near' },
            { id: 'bnm.near' },
            { id: 'vcnzxc.near' },
            { id: 'weqedsfs.near' },
            { id: 'qwesd.near' },
        ],
    };
    const answer = [
        {
            participantId: 'xtest3.testnet',
            element_id: '8ArNoKHTUmLJCz7j6mhZqcSmkAE7WXALtnQPLtkLJUa29SPhX9PdrK2ssutouTELD3adyWg859gpgx9uwEUTS',
            title: ['q_test2222332254_ggg33_vvbbv'],
            type: 2,
            answer: ['123123'],
            submit_time: '1642435661826020381',
        },
    ];
    const forms = JSON.parse(localStorage.getItem('myForms'));
    const [openModal, setOpenModal] = useState(false);

    const onRenderParticipant = (participant, index) => {
        const shortName = `${participant?.[0]}${participant?.[1]}`;
        return (
            <div className={styles.participant_area} key={index} onClick={() => onParticipantDetailClicked(participant)}>
                <div className={styles.participant_area_avata} style={{ background: onRandomColorBg() }}>
                    {shortName}
                </div>
                <div className={styles.participant_area_name}>{participant}</div>
            </div>
        );
    };

    const onParticipantDetailClicked = () => {
        setOpenModal(true);
    };

    const onRandomColorBg = () => {
        return color[Math.floor(Math.random() * 5)];
    };

    const onCloseModal = () => {
        setOpenModal(false);
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
            case 'fillBlank':
                return <FillBlank index={index} elType={type} type={'analysis'} defaultValue={defaultValue} />;

            default:
                break;
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.content_left}>
                    <div className={styles.form_analysis_title}>{data.title}</div>
                    <div className={styles.form_analysis_text}>Total Question(s): {data.total}</div>
                    <div className={styles.form_analysis_text}>Total Participant(s): {data.q_participant}</div>
                    {data?.a_participant?.length > 0 ? (
                        <div className={styles.participant_root}>
                            <div className={styles.participant_list}>
                                {data?.a_participant?.map((item, index) => {
                                    return onRenderParticipant(item.id, index);
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.participant_nothing}>
                            <div className={styles.nothing_text}>Nothing to display</div>
                        </div>
                    )}
                </div>
                <div className={styles.participant_preview}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Result of: <span style={{ color: 'var(--color-link)' }}>anhhd.near</span>
                    </Typography>
                    <div className={styles.line} />
                    <div className={styles.modal_content}>
                        {forms?.map?.((item, index) => {
                            return (
                                <div className={styles.element_content} key={index}>
                                    {renderElement(item, index)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Modal open={openModal} onClose={onCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}></Box>
            </Modal>
        </div>
    );
};

export default FormAnalysis;
