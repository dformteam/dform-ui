/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import styles from './EventDetail.module.scss';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { utils } from 'near-api-js';
import { Web3Storage } from 'web3.storage';
import Notify from '../../../components/Notify';
import Confirmation from '../../../components/Confirmation';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ModalShare from '../../../components/Share';

const EventDetail = ({ id }) => {
    const raws = useRef([]);
    const wallet = useSelector((state) => state.wallet);
    const { walletConnection } = wallet;
    const userId = walletConnection.getAccountId();
    const router = useRouter();
    const [attendees, setAttendence] = useState([]);
    const [coverImage, setCoverImage] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isInterested, setIsInterested] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [snackMsg, setSnackMsg] = useState('');
    const [event, setEvent] = useState({});
    const [newestEventList, setNewestEventList] = useState([]);
    const [eventId, setEventId] = useState(id);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalShare, setModalShare] = useState(false);
    const [link, setLink] = useState('');
    const [isInterestedLoad, setIsInterestedLoad] = useState(false);
    const [interestList, setInterestList] = useState([]);

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
        let event_id = id;
        async function fetchEventId() {
            const { contract, walletConnection } = wallet;
            const userId = walletConnection.getAccountId();
            await contract
                ?.get_recent_event_created?.({})
                .then((e_id) => {
                    window.location = `/event/event-detail?id=${e_id}`;
                })
                .catch((err) => {
                    setOpenLoading(false);
                    onShowResult({
                        type: 'error',
                        msg: `${err}`,
                    });
                });
        }
        if (id == 'created') {
            setOpenLoading(true);
            fetchEventId();
        } else {
            setOpenLoading(false);
            onGetEventDetail(event_id);
        }
    }, []);

    const onExportDateTime = (datetime) => {
        try {
            const timestamp = parseFloat(datetime);
            const date = new Date(timestamp);
            const localDate = date.toLocaleDateString();
            const localTime = date.toLocaleTimeString();
            return `${localDate} @ ${localTime}`;
        } catch {
            return 'unknow';
        }
    };

    useEffect(() => {
        onGetMaxInterestedRows();
    }, []);

    useEffect(() => {
        onGetNewestEvents();
    }, []);

    const newestEvents = [];

    const generateEvent = (event) => {
        let event_type = 'Online';
        switch (event.event_type) {
            case 1:
                event_type = 'In person';
                break;
            case 2:
                event_type = 'Online + In person';
                break;
        }
        let eventInfo = {
            id: event.id,
            owner: event.owner,
            name: event.name,
            type: event_type,
            date: onExportDateTime(event.start_date),
            date_timestamp: event.start_date,
            attendees: event.participants.length,
            cover_image: event.cover_image,
            img: '/calendar.svg',
            isInterested: false,
        };
        return eventInfo;
    };

    const onGetNewestEvents = () => {
        let isMounted = true;
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        contract
            ?.get_newest_events?.({})
            .then((newest_events) => {
                if (newestEvents) {
                    newest_events.data.map((event) => {
                        let eventInfo = generateEvent(event);
                        newestEvents.push(eventInfo);
                    });
                    if (isMounted) setNewestEventList([...newestEvents]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            isMounted = false;
        };
    };



    const onGetEventDetail = (eventId) => {
        const { contract } = wallet;

        contract
            ?.get_event({
                eventId: eventId,
            })
            .then((res) => {
                if (res) {
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

    const onEventFavoriteClick = (item) => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        if (userId == item.owner) {
            onShowResult({
                type: 'error',
                msg: 'You are the owner of this event',
            });
            return;
        }
        setOpenLoading(true);
        contract
            ?.interest_event(
                {
                    eventId: event.id,
                },
                50000000000000,
            )
            .then((res) => {
                if (res) {
                    onShowResult({
                        type: 'success',
                        msg: res,
                    });
                    // setIsInterested(res == 'Interested' ? true : false);
                    setNewestEventList(
                        [...newestEventList].map((event) => {
                            if (event.id === item.id) {
                                return item;
                            } else {
                                return event;
                            }
                        }),
                    );
                } else {
                    onShowResult({
                        type: 'error',
                        msg: 'Error when interested',
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

    const onGetParticipants = ({ total }) => {
        const { contract } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        setAttendence([]);

        page_arr.map((page, index) => {
            return contract
                .get_event_participants({
                    eventId: eventId,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        // console.log(data);
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
                            setAttendence([...temp_prt]);
                            if (temp_prt.includes(userId)) {
                                setIsRegistered(true);
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    };

    const onAttendClick = () => {
        const { contract } = wallet;
        if (event.end_date <= Date.now()) {
            onShowResult({
                type: 'error',
                msg: 'This Event has ended!',
            });
            return;
        }
        setOpenLoading(true);
        if (isRegistered) {
            contract
                ?.leave_event(
                    {
                        'eventId': eventId,
                    },
                    50000000000000,
                )
                .then((res) => {
                    if (res) {
                        onGetEventDetail(eventId);
                        onShowResult({
                            type: 'success',
                            msg: 'Leaved',
                        });
                        setIsRegistered(false);
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
                        eventId: eventId,
                    },
                    50000000000000,
                    event?.enroll_fee,
                )
                .then((res) => {
                    if (res) {
                        onGetEventDetail(eventId);
                        onShowResult({
                            type: 'success',
                            msg: 'Register succesfully',
                        });
                        setIsRegistered(true);
                        // setModalSuccess(true);
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
                        eventId: eventId,
                    },
                    50000000000000,
                )
                .then((res) => {
                    console.log(res);
                    if (res) {
                        onGetEventDetail();
                        onShowResult({
                            type: 'success',
                            msg: 'Register succesfully',
                        });
                        setIsRegistered(true);
                        // setModalSuccess(true);
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
        if (res.ok) {
            const files = await res.files();
            for (const file of files) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    setCoverImage(e.target.result);
                };
            }
        } else {
            setCoverImage('/calendar.svg');
        }
    };

    const onPublishEventClick = () => {
        router.push(`/event/publish-event?id=${eventId}`);
    };

    const onUnpublishEventClick = () => {
        const { contract } = wallet;

        setOpenLoading(true);

        contract
            ?.unpublish_event?.({
                eventId: eventId,
            })
            .then((res) => {
                if (res) {
                    let state = {
                        status: 0,
                        owner: userId
                    };
                    setEvent({ ...state });
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

    const onAcceptUnpublish = () => {
        setOpenConfirmation(false);
        onUnpublishEventClick();
    };

    const onDenyUnpublish = () => {
        setOpenConfirmation(false);
    };

    const onShareClick = () => {
        setModalSuccess(false);
        const uri = new URL(window.location.href);
        const { origin } = uri;
        setLink(`${origin}/event/event-detail?id=${id}`);
        setModalShare(true);
    };

    const onCloseModalShare = () => {
        setModalShare(false);
    };

    const onSuccess = () => {
        onShowResult({
            type: 'success',
            msg: 'copied',
        });
    };

    useEffect(() => {
        if (newestEventList !== []) {
            retrieveImagesCover(newestEventList);
        }
    }, [newestEventList]);

    useEffect(() => {
        if (JSON.stringify(newestEventList) !== '[]' && !isInterestedLoad) {
            onGetMaxInterestedRows();
            setIsInterestedLoad(true);
        }
    }, [newestEventList]);


    const onGetMaxInterestedRows = () => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        contract
            ?.get_interested_event_count?.({
                userId: userId,
            })
            .then((total) => {
                onGetInterestedRows({ total });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetInterestedRows = async ({ total }) => {
        const { contract, walletConnection } = wallet;
        const num_page = total % 5 === 0 ? total / 5 : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        const userId = walletConnection.getAccountId();
        const current_timestamp = Date.now();
        await Promise.all(
            page_arr.map(async (page, index) => {
                await contract
                    .get_interested_events({
                        userId,
                        page: index + 1,
                    })
                    .then((data) => {
                        if (data) {
                            let listId = [];
                            data.data.map((event) => {
                                listId.push(event.id);
                            });
                            setInterestList(listId);
                        }
                    });
            }),
        );
    };

    const retrieveImagesCover = async (list_event) => {
        await Promise.all(
            list_event.map(async (event) => {
                return new Promise(async (resolve, reject) => {
                    if (!event.cover_image || event.cover_image == '') {
                        resolve(event);
                    }
                    const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_w3key });
                    const res = await client.get(event.cover_image);
                    if (res.ok) {
                        const files = await res.files();
                        for (const file of files) {
                            let reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = (e) => {
                                event.img = e.target.result;
                                resolve(event);
                            };
                        }
                    } else {
                        resolve(event);
                    }
                });
            }),
        );
    };

    const renderInterestedIcon = (item) => {
        if (item.isInterested) {
            return <FavoriteIcon className={styles.event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />;
        } else {
            return <FavoriteBorderIcon className={styles.event_item_icon_favor} onClick={() => onEventFavoriteClick(item)} />;
        }
    };

    const renderEventItem = (item) => {
        return (
            <div className={styles.event_item} key={item.id}>
                <div className={styles.event_item_header}>
                    <div className={styles.event_item_type}>{item.type}</div>
                    {/* <img src={'/calendar.svg'} className={styles.event_item_img} alt="img" onClick={() => router.push(`/event/event-detail?id=${item.id}`)} /> */}
                    <img src={item.img} className={styles.event_item_img} alt="img" onClick={() => router.push(`/event/event-detail?id=${item.id}`)} />
                </div>
                <div className={styles.event_item_info}>
                    <div className={styles.event_item_date}>{item.date}</div>
                    <div className={styles.event_item_name} onClick={() => router.push(`/event/event-detail?id=${item.id}`)}>
                        {item.name}
                    </div>
                    <div className={styles.event_item_footer}>
                        <div className={styles.event_item_attendees}>{item.attendees} attendees</div>
                        <ShareOutlinedIcon className={styles.event_item_icon} onClick={() => {
                            onGetSharedLink(item.id)
                        }} />
                        {renderInterestedIcon(item)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            {openConfirmation && <Confirmation label={confirmationLabel} onAccept={onAcceptUnpublish} onCancel={onDenyUnpublish} />}

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
                            <button className={styles.content_button_area_button} onClick={() => setOpenConfirmation(true)}>
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
                                <img src={coverImage} alt="cover" className={styles.content_detail_cover_img} />
                            </div>
                            <div className={styles.content_detail_info}>
                                <div className={styles.content_detail_info_row}>
                                    <AccessAlarmOutlinedIcon className={styles.content_detail_info_icon} />
                                    <div className={styles.content_detail_info_column}>
                                        <div className={styles.content_detail_info_date}>{exportStartDate(event?.start_date)}</div>
                                        <div className={styles.content_detail_info_date}>to</div>
                                        <div className={styles.content_detail_info_date}>{exportStartDate(event?.end_date)}</div>
                                        {/* <div className={styles.content_detail_info_add} onClick={onAttendClick}>
                                            Add to calendar
                                        </div> */}
                                    </div>
                                </div>
                                <div className={styles.content_detail_info_row}>
                                    <AttachFileOutlinedIcon className={styles.content_detail_info_icon} />
                                    <div className={styles.content_detail_info_column}>
                                        <div className={styles.content_detail_info_date}>
                                            {eventType.map((type) => {
                                                if (event.type == type.typeId) {
                                                    return type.label;
                                                }
                                            })}
                                        </div>
                                        <div className={styles.content_detail_info_link}>{event.url || 'This event has no link'}</div>
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
                                    {newestEventList.map((item) => renderEventItem(item))}
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
                                    <ShareOutlinedIcon className={styles.content_action_icon} onClick={onShareClick} />
                                    {/* <FavoriteBorderIcon className={styles.content_action_icon_favor} /> */}
                                    {renderInterestedIcon(isInterested)}
                                </div>
                                <button className={styles.content_button_attend} onClick={onAttendClick}>
                                    {isRegistered ? 'Un-Register' : 'Register'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal open={modalSuccess} onClose={() => setModalSuccess(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={'center'}>
                        Your event
                    </Typography>
                    <div className={styles.line} />
                    <div className={styles.modal}>
                        <div className={styles.modal_date}>{exportStartDate(event?.start_date)}</div>
                        <button className={styles.modal_button} onClick={onAttendClick}>
                            Add to calendar
                        </button>
                        <button className={styles.modal_button_share} onClick={onShareClick}>
                            Share this event
                        </button>
                    </div>
                </Box>
            </Modal>

            {modalShare && <ModalShare link={link} onCloseModal={onCloseModalShare} onSuccess={onSuccess} />}
        </>
    );
};

EventDetail.getInitialProps = async (ctx) => {
    const id = ctx.query.id;
    return { id };
};

export default EventDetail;

const aEvents = [
    // {
    //     id: 1,
    //     name: 'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club © 2021 Learn NEAR Club',
    //     type: 'Online',
    //     date: 'Sat, Jan 15 @ 5:30 PM',
    //     attendees: 16,
    // },
    // { id: 2, name: '© 2021 Learn NEAR Club', type: 'Online + In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 66 },
    // { id: 3, name: 'Event 3', type: 'In person', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
    // { id: 4, name: 'Event 4', type: 'Online', date: 'Sat, Jan 15 @ 5:30 PM', attendees: 16 },
];

const eventType = [
    { id: 'online', typeId: 0, label: 'Online' },
    { id: 'in_person', typeId: 1, label: 'In Person' },
    { id: 'both', typeId: 2, label: 'Online + In Person' },
];

const confirmationLabel = {
    title: 'Confirmation',
    desc: 'Are you sure to unpublish this event?',
    accept: 'Accept',
    cancel: 'Deny',
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: '#fff',
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    paddingTop: '20px',
};
