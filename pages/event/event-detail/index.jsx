/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import styles from './EventDetail.module.scss';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { utils } from 'near-api-js';
import { Web3Storage } from 'web3.storage';
import Notify from '../../../components/Notify';

const EventDetail = ({ id }) => {
    const raws = useRef([]);
    const wallet = useSelector((state) => state.wallet);
    const { walletConnection } = wallet;
    const userId = walletConnection.getAccountId();
    const router = useRouter();
    const [attendees, setAttendence] = useState([]);
    const [cover_image, setCoverImage] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [event, setEvent] = useState({});

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
        onGetEventDetail();
    }, []);

    const onGetEventDetail = () => {
        const { contract } = wallet;

        contract
            ?.get_event({
                eventId: id,
            })
            .then((res) => {
                if (res) {
                    console.log(res);
                    const { status, owner } = res;
                    if (status === 0 && owner !== userId) {
                        redirectError('You do not permission to access this page');
                    } else {
                        setEvent({ ...res });
                        retrieveImageCover(res.cover_img);
                        onGetParticipants({ total: res.participants });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetParticipants = ({ total }) => {
        const { contract } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        setAttendence([]);

        page_arr.map((page, index) => {
            return contract
                .get_event_participants({
                    eventId: id,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        console.log(data);
                        const pIndex = raws.current.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            raws.current.push(data);
                            raws.current.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let temp_prt = [];
                            raws.current.map((raw) => {
                                temp_prt = [...temp_prt, ...(raw?.data || [])];
                                return temp_prt;
                            });

                            console.log(temp_prt);

                            setAttendence([...temp_prt]);
                            if (temp_prt.includes(userId)) {
                                setIsRegistered(true);
                            }
                        }

                        console.log(pIndex);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    };

    const onAttendClick = () => {
        const { contract } = wallet;
        setOpenLoading(true);
        if (isRegistered) {
            contract
                ?.leave_event(
                    {
                        eventId: id,
                    },
                    50000000000000,
                )
                .then((res) => {
                    if (res) {
                        onGetEventDetail();
                        onShowResult({
                            type: 'success',
                            msg: 'Leaved',
                        });
                    } else {
                        onShowResult({
                            type: 'error',
                            msg: 'Could not leave',
                        });
                    }
                })
                .catch((err) => {
                    onShowResult({
                        type: 'error',
                        msg: String(err),
                    });
                });
            setIsRegistered(false);
            return;
        }
        if (event?.enroll_fee !== '0') {
            contract
                ?.join_event(
                    {
                        eventId: id,
                    },
                    50000000000000,
                    event?.enroll_fee,
                )
                .then((res) => {
                    if (res) {
                        onGetEventDetail();
                        onShowResult({
                            type: 'success',
                            msg: 'Register succesfully',
                        });
                    } else {
                        onShowResult({
                            type: 'error',
                            msg: 'Could not register',
                        });
                    }
                })
                .catch((err) => {
                    onShowResult({
                        type: 'error',
                        msg: String(err),
                    });
                });
        } else {
            contract
                ?.join_event(
                    {
                        eventId: id,
                    },
                    50000000000000,
                )
                .then((res) => {
                    if (res) {
                        onGetEventDetail();
                        onShowResult({
                            type: 'success',
                            msg: 'Register succesfully',
                        });
                    } else {
                        onShowResult({
                            type: 'error',
                            msg: 'Could not register',
                        });
                    }
                })
                .catch((err) => {
                    onShowResult({
                        type: 'error',
                        msg: String(err),
                    });
                });
        }
    };

    const retrieveImageCover = async (cover_id) => {
        const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_w3key });
        const res = await client.get(cover_id);
        const files = await res.files();

        for (const file of files) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setCoverImage(e.target.result);
            };
        }
    };

    const onPublishEventClick = () => {
        router.push(`/event/publish-event?id=${id}`);
    };

    const onUnpublishEventClick = () => {
        const { contract } = wallet;

        setOpenLoading(true);

        contract
            ?.unpublish_event?.({
                eventId: id,
            })
            .then((res) => {
                if (res) {
                    onShowResult({
                        type: 'success',
                        msg: 'Event has been unpublished',
                    });
                } else {
                    onShowResult({
                        type: 'error',
                        msg: 'Somethings went wrong, please try again!',
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

    const redirectError = (content) => {
        const encoded_content = encodeURIComponent(content);
        router.push(`/error?content=${encoded_content}`);
    };

    const exportStartDate = (date) => {
        return new Date(parseFloat(date)).toLocaleString();
    };

    const onExtractFee = () => {
        if (event?.enroll_fee === '0') {
            return 'FREE';
        } else {
            return `${utils.format.formatNearAmount(event?.enroll_fee || 0)} Ⓝ`;
        }
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.content}>
                    {event?.status === 0 && event?.owner === userId && (
                        <div className={styles.content_button_area}>
                            <button className={styles.content_button_area_button} onClick={onPublishEventClick}>
                                <PublishIcon className={styles.content_button_area_button_icon} /> Publish
                            </button>
                        </div>
                    )}
                    {event?.status !== 0 && event?.owner === userId && (
                        <div className={styles.content_button_area}>
                            <button className={styles.content_button_area_button} onClick={onUnpublishEventClick}>
                                <UnpublishedOutlinedIcon className={styles.content_button_area_button_icon} /> Unpublish
                            </button>
                        </div>
                    )}
                    <div className={styles.content_event}>
                        <div className={styles.content_info}>
                            <div className={styles.content_info_date}>{exportStartDate(event?.start_date)}</div>
                            <div className={styles.content_info_name}>{event?.title}</div>
                            <div className={styles.content_info_row}>
                                <img src={'/calendar.svg'} className={styles.content_info_row_icon} alt="img" />
                                <div className={styles.content_info_row_info}>
                                    <div className={styles.content_info_row_info_host}>Hosted By</div>
                                    <div className={styles.content_info_row_info_wallet}>{event?.owner}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.line} />
                    <div className={styles.content_detail}>
                        <div className={styles.content_detail_row}>
                            <div className={styles.content_detail_cover}>
                                <img src={cover_image} alt="cover" className={styles.content_detail_cover_img} />
                            </div>
                            <div className={styles.content_detail_info}>
                                <div className={styles.content_detail_info_row}>
                                    <AccessAlarmOutlinedIcon className={styles.content_detail_info_icon} />
                                    <div className={styles.content_detail_info_column}>
                                        <div className={styles.content_detail_info_date}>{exportStartDate(event?.start_date)}</div>
                                        <div className={styles.content_detail_info_date}>to</div>
                                        <div className={styles.content_detail_info_date}>{exportStartDate(event?.end_date)}</div>
                                        <div className={styles.content_detail_info_add}>Add to calendar</div>
                                    </div>
                                </div>
                                <div className={styles.content_detail_info_row}>
                                    <AttachFileOutlinedIcon className={styles.content_detail_info_icon} />
                                    <div className={styles.content_detail_info_column}>
                                        <div className={styles.content_detail_info_date}>Online event</div>
                                        <div className={styles.content_detail_info_link}>https://vnexpress.net/</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.content_detail_label}>Details</div>
                        <div className={styles.content_detail_text}>
                            {event?.description?.map((des, index) => {
                                return (
                                    <div key={index}>
                                        {des}
                                        <br />
                                        <br />
                                    </div>
                                );
                            })}
                        </div>
                        {event?.status !== 0 && (
                            <>
                                <div className={styles.content_detail_row_space}>
                                    <div className={styles.content_detail_label}>Attendees ({attendees?.length || 0})</div>
                                    <div className={styles.content_detail_see_all}>See all</div>
                                </div>
                                {attendees?.length > 0 ? (
                                    <div className={styles.content_detail_list}>
                                        {attendees?.map?.((item, index) => {
                                            return (
                                                <div className={styles.content_detail_list_wallet} key={index}>
                                                    {item}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={styles.content_detail_list_nothing}>No thing to display</div>
                                )}
                            </>
                        )}
                        {event?.status !== 0 && (
                            <>
                                <div className={styles.content_detail_row_space}>
                                    <div className={styles.content_detail_label}>Similar Events</div>
                                    <div className={styles.content_detail_see_all}>See all</div>
                                </div>
                                <div className={styles.content_detail_list}>
                                    {aEvents.map((item, index) => {
                                        return (
                                            <div className={styles.content_detail_list_item} key={index}>
                                                <div className={styles.content_detail_list_name}>
                                                    <div className={styles.content_detail_list_name_text}>{item.name}</div>
                                                </div>
                                                <button className={styles.content_detail_list_attend}>Attend</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.footer_content}>
                        <div className={styles.footer_content_info}>
                            <div className={styles.footer_content_info_date}>{exportStartDate(event?.start_date)}</div>
                            <div className={styles.footer_content_info_name}>{event?.title}</div>
                        </div>
                        {event?.status !== 0 && <div className={styles.content_info_row_fee}>{onExtractFee()}</div>}
                        {event?.status !== 0 && event?.owner !== userId && (
                            <>
                                <div className={styles.content_action}>
                                    <ShareOutlinedIcon className={styles.content_action_icon} />
                                    <FavoriteBorderIcon className={styles.content_action_icon_favor} />
                                </div>
                                <button className={styles.content_button_attend} onClick={onAttendClick}>
                                    {isRegistered ? 'Un-Register' : 'Register'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

EventDetail.getInitialProps = async (ctx) => {
    const id = ctx.query.id;
    return { id };
};

export default EventDetail;

const aEvents = [
    {
        id: 1,
        name: 'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club',
        type: 'Online',
        date: 'Sat, Jan 15 @ 5:30 PM',
        attendees: 16,
    },
    { id: 2, name: '© 2021 Learn NEAR Club', type: 'Online + In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 66 },
    { id: 3, name: 'Event 3', type: 'In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
    { id: 4, name: 'Event 4', type: 'Online', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
];
