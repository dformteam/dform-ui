import '../styles/global.css';
import { Provider } from 'react-redux';
import Store from '../redux/store';
import Layout from '../components/Layout';

const app = ({ Component, pageProps }) => {
    return (
        <>
            <div className="form_bg" />
            <Provider store={Store}>
                <Layout {...pageProps}>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        </>
    );
};

export default app;
