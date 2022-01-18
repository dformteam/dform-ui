import { utils } from 'near-api-js';
import { useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const JoinForm = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const [fee, setFee] = useState(0);
    const [joined, setJoined] = useState(false);

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
                formId: id,
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

    return <div></div>;
};

export default JoinForm;
