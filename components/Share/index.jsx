import React from 'react';
import styles from './Share.module.scss';
import {
    FacebookShareButton,
    TwitterShareButton,
    TelegramShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    EmailIcon,
} from 'react-share';

const Share = () => {
    const shareUrl = 'http://github.com';
    const title = 'GitHub';

    return (
        <div className={styles.container}>
            <FacebookShareButton url={shareUrl} quote={title} className={styles.container_network}>
                <FacebookIcon size={32} round />
                <div className={styles.container_network_title}>Facebook</div>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={title} className={styles.container_network}>
                <TwitterIcon size={32} round />
                <div className={styles.container_network_title}>Twitter</div>
            </TwitterShareButton>

            <TelegramShareButton url={shareUrl} title={title} className={styles.container_network}>
                <TelegramIcon size={32} round />
                <div className={styles.container_network_title}>Telegram</div>
            </TelegramShareButton>

            <EmailShareButton url={shareUrl} title={title} className={styles.container_network}>
                <EmailIcon size={32} round />
                <div className={styles.container_network_title}>Email</div>
            </EmailShareButton>
        </div>
    );
};

export default Share;
