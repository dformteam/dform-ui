import React, { useState, useEffect, useRef, Fragment } from 'react';
import styles from './Account.module.scss';
import { useSelector } from 'react-redux';
import { Popover } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownCircleSharpIcon from '@mui/icons-material/ArrowDropDownCircleSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Router, { useRouter } from 'next/router';

const UserAccount = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();
    const aMenu = [
        { id: 'my-form', label: 'My Form' },
        { id: 'my-event', label: 'My Event' },
    ];
    const wrapperRef = useRef(null);

    const [popoverVisible, setPopoverVisible] = useState(false);

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    const handleClick = (event) => {
        const { target } = event;
        if (wrapperRef.current && !wrapperRef.current.contains(target)) {
            setPopoverVisible(false);
        }
    };

    const onNavItemClick = (id) => {
        setPopoverVisible(false);
        let route = '/form/' + id;
        Router.push(route);
    };

    const [state, setState] = useState({
        anchorEl: null,
        popoverOpen: false,
        popoverId: undefined,
    });
    const onRequestConnectWallet = () => {
        const { nearConfig, walletConnection } = wallet;
        walletConnection?.requestSignIn?.(nearConfig?.contractName);
    };

    const onRequestSignOut = () => {
        const { walletConnection } = wallet;
        walletConnection.signOut();
        router.push('/');
    };

    const onRenderSignInButton = () => {
        return (
            <div className={styles.signIn_area}>
                <button className={styles.signIn_button} onClick={onRequestConnectWallet}>
                    Connect the wallet
                </button>
            </div>
        );
    };

    const onOpenAccountPopover = (e) => {
        setPopoverVisible(false);
        setPopoverVisible(!popoverVisible);
    };

    const onCloseAccountPopover = () => {
        setState({
            anchorEl: null,
            popoverOpen: false,
            popoverId: undefined,
        });
    };

    const onRenderAccountDetail = () => {
        const { walletConnection } = wallet;
        const { anchorEl, popoverOpen, popoverId } = state;
        const accountId = walletConnection?.getAccountId?.();
        let popoverRight = 1000;
        if (typeof window !== 'undefined') {
            popoverRight = window?.screen?.width - 15;
        }
        return (
            <div className={styles.signIn_area} ref={wrapperRef}>
                <button className={styles.account_button} onClick={onOpenAccountPopover}>
                    <div className={styles.account_button_icon_area}>
                        <AccountCircleOutlinedIcon className={styles.account_button_icon} />
                    </div>
                    <div className={styles.account_button_accountId_area}>{accountId}</div>
                    <div>
                        <ArrowDropDownCircleSharpIcon className={styles.account_button_drop_icon} />
                    </div>
                </button>
                {popoverVisible && (
                    <div className={styles.account_popover}>
                        {aMenu.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <div className={styles.account_popover_label} onClick={() => onNavItemClick(item.id)}>
                                        {item.label}
                                    </div>
                                    <div className={styles.line} />
                                </Fragment>
                            );
                        })}
                        <div className={styles.account_popover_label} onClick={onRequestSignOut}>
                            <LogoutSharpIcon className={styles.account_popover_icon} />
                            Log out
                        </div>
                    </div>
                )}
                <Popover
                    id={popoverId}
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={onCloseAccountPopover}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: 70, left: popoverRight }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    className={styles.popover_container}
                >
                    <div className={styles.signOut_area}>
                        <button className={styles.signOut_button} onClick={onRequestSignOut}>
                            <LogoutSharpIcon className={styles.signOut_button_icon} />
                            <div className={styles.signOut_button_content}>Logout</div>
                        </button>
                    </div>
                </Popover>
            </div>
        );
    };

    const onRenderScene = () => {
        const { walletConnection } = wallet;
        const isSigned = walletConnection?.isSignedIn?.();
        if (isSigned) {
            return onRenderAccountDetail();
        }
        return onRenderSignInButton();
    };

    return <div className={styles.root}>{onRenderScene()}</div>;
};

export default UserAccount;
