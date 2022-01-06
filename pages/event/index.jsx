import styles from './Event.module.scss';

const Event = () => {
    return (
        <div className={styles.root}>
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Event</div>
        </div>
    );
};

export default Event;