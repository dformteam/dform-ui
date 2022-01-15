import React, { useState } from 'react';
import styles from './Account.module.scss';
import { connect, useSelector } from 'react-redux';
import { Popover } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownCircleSharpIcon from '@mui/icons-material/ArrowDropDownCircleSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { useRouter, withRouter } from 'next/router';

const UserAccount = () => {
    const wallet = useSelector((state) => state.wallet);
    const router = useRouter();

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
        setState({
            anchorEl: e.target,
            popoverOpen: true,
            popoverId: 'simple-popover',
        });
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
            <div className={styles.signIn_area}>
                <button className={styles.account_button} onClick={onOpenAccountPopover}>
                    <div className={styles.account_button_icon_area}>
                        <AccountCircleOutlinedIcon className={styles.account_button_icon} />
                    </div>
                    <div className={styles.account_button_accountId_area}>{accountId}</div>
                    <div>
                        <ArrowDropDownCircleSharpIcon className={styles.account_button_drop_icon} />
                    </div>
                </button>
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
