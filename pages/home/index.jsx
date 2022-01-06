import styles from './Home.module.scss';

const Home = () => {
    return (
        <div className={styles.root}>
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Landing page here.</div>
        </div>
    );
};

export default Home;
