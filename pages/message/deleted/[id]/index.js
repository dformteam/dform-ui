import { useRouter } from 'next/router';
import styles from './MessageDetail.module.scss';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import ShortcutOutlinedIcon from '@mui/icons-material/ShortcutOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const MessageDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    console.log(id);

    const onRandomColorBg = () => {
        return color[Math.floor(Math.random() * 5)];
    };

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.header_subject}>[Action required] Verify your TeamViewer account</div>
                <button className={styles.header_button}>
                    <RestoreOutlinedIcon />
                    Restore
                </button>
                <button className={styles.header_button}>
                    <DeleteOutlinedIcon />
                    Delete
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.content_detail}>
                    <div className={styles.content_detail_avatar} style={{ background: onRandomColorBg() }}>
                        AH
                    </div>
                    <div className={styles.content_detail_info}>
                        <div className={styles.content_detail_info_name}>TeamViewer Account Activation &lt;AccountActivation-noreply@teamviewer.com&gt;</div>
                        <div className={styles.content_detail_info_sub}>Thu 10/28/2021 12:46 PM</div>
                        <div className={styles.content_detail_info_label}>To: You</div>
                    </div>
                    <div className={styles.content_detail_action}>
                        <button className={styles.content_detail_action_btn}>
                            <ReplyOutlinedIcon />
                        </button>
                        <button className={styles.content_detail_action_btn}>
                            <ShortcutOutlinedIcon />
                        </button>
                    </div>
                </div>
                <div className={styles.content_message}>
                    Hi Hà Đức Anh, Thank you for creating a TeamViewer account. For your security, please verify your account by clicking the button below.
                    Verify My Account Questions? Need help? Please visit TeamViewer Support. Happy connecting, TeamViewer
                </div>
                <div className={styles.content_footer}>
                    <button className={styles.content_footer_button}>
                        <ReplyOutlinedIcon />
                        Reply
                    </button>
                    <button className={styles.content_footer_button}>
                        <ShortcutOutlinedIcon />
                        Forward
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageDetail;

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
