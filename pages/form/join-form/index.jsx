import styles from './JoinForm.module.scss';
import { utils } from 'near-api-js';
import { useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';

const JoinForm = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const [fee, setFee] = useState(0);
    const [joined, setJoined] = useState(false);
    const { query } = router;

    useLayoutEffect(() => {
        onGetFormDetail();
    }, []);

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
                    const { enroll_fee, start_date, end_date, participants, limit_participants, owner } = res;
                    const content = '';
                    const currentTimestamp = Date.now();
                    if (0 === owner) {
                        return redirectError('This form has not been published!');
                    } else if (currentTimestamp > end_date) {
                        return redirectError('This form has been ended');
                    } else if (currentTimestamp < start_date) {
                        return redirectError('This form has not been started');
                    } else if (limit_participants > 0 && participants?.length >= limit_participants) {
                        return redirectError('This form has been reached the limitation of participant ');
                    }

                    if (content !== '') {
                        const encoded_content = encodeURIComponent(content);
                        router.push(`/error?content=${encoded_content}`);
                    }

                    setFee(enroll_fee);
                    getParticipantFormDetail();
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
                    const { joined } = res;
                    setJoined(joined);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onJoinForm = () => {
        const { contract, walletConnection } = wallet;
        const { id } = query;
        const userId = walletConnection.getAccountId();
        if (joined) {
            router.push(`/form/form-answer?id=${id}`);
        } else if (fee === 0) {
            contract
                ?.join_form(
                    {
                        formId: id,
                    },
                    100000000000000,
                )
                .then((res) => {
                    if (res) {
                        router.push(`/form/form-answer?id=${id}`);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (fee !== 0) {
            const yoctoNear = utils.format.parseNearAmount(`${fee}`);
            contract
                ?.join_form(
                    {
                        formId: id,
                    },
                    100000000000000,
                    yoctoNear,
                )
                .then((res) => {
                    if (res) {
                        router.push(`/form/form-answer?id=${id}`);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const redirectError = (content) => {
        const encoded_content = encodeURIComponent(content);
        router.push(`/error?content=${encoded_content}`);
    };

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Form Detail
                </Typography>
                <div className={styles.form_row}>
                    <div className={styles.form_label}>Name</div>
                    <div className={styles.form_input}>{'form_title'}</div>
                </div>
                <div className={styles.form_row}>
                    <div className={styles.form_label}>Description</div>
                    <div className={styles.form_input}>{'form_description'}</div>
                </div>
                <div className={styles.fee_row}>
                    <div className={styles.fee_label}>Joining Fee</div>
                    <div className={styles.fee_input}>{fee > 0 ? fee + ' NEAR' : 'FREE'}</div>
                </div>
                <div className={styles.fee_row}>
                    <div className={styles.fee_label}>Starting time</div>
                    <input className={styles.fee_input_date} type={'datetime-local'} onChange={() => {}} />
                    <div className={styles.fee_label_paid}>Ending time</div>
                    <input className={styles.fee_input_date} type={'datetime-local'} onChange={() => {}} />
                </div>
                <div className={styles.form_row_button}>
                    <button className={styles.form_create_button} onClick={onJoinForm}>
                        Join form
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinForm;
