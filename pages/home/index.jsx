import styles from './Home.module.scss';
import Notify from '../../components/Notify';

const Home = () => {
    return (
        <div className={styles.root}>
            <Notify openLoading={true} openSnack={true} alertType={'success'} snackMsg={'snackMsg'} onClose={() => {}} />
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Landing page here.</div>
        </div>
    );
};

export default Home;
