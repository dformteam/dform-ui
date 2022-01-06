import styles from './Form.module.scss';
import Image from 'next/image';
import IconTemplate from './IconTemplate.svg';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Router from 'next/router';

const Form = () => {
    const aTemplate = [
        { id: 'blank', title: 'Blank', name: 'Create a blank form', route: '/form/create-form' },
        { id: 'demo_day', title: 'Demo day', name: `© ${new Date().getFullYear()} Learn NEAR Club`, route: '/create-form' },
    ];

    const aRecent = [
        { id: '1', title: 'Blank', subtitle: 'Create a blank form', lastUpdate: '20:00 29/12/2021' },
        { id: '2', title: 'Demo day © 2021 Learn NEAR Club © 2021 Learn NEAR Club', subtitle: '© 2021 Learn NEAR Club', lastUpdate: '21:00 30/12/2021' },
        { id: '1', title: 'Blank', subtitle: 'Create a blank form', lastUpdate: '20:00 29/12/2021' },
    ];

    const onCreateClick = (route) => {
        Router.push(route);
    };

    return (
        <div className={styles.root}>
            <div className={styles.label}>
                <div className={styles.label_title}>Start a new form</div>
                <div className={styles.label_text}>
                    Show all template <ChevronRightOutlinedIcon className={styles.icon_collapse} />
                </div>
            </div>
            <div className={styles.content}>
                {aTemplate.map((item, index) => {
                    return (
                        <div className={styles.template} key={index} onClick={() => onCreateClick(item.route)}>
                            <div className={styles.template_content}>
                                {item.id === 'blank' ? (
                                    <AddOutlinedIcon fontSize="large" className={styles.template_icon_add} />
                                ) : (
                                    <div className={styles.template_icon}>
                                        <Image src={IconTemplate} layout="fill" alt={'Error'} priority={true} />
                                    </div>
                                )}
                            </div>
                            <div className={styles.template_title}>{item.title}</div>
                            <div className={styles.template_name}>{item.name}</div>
                        </div>
                    );
                })}
            </div>
            <div className={styles.label_recent}>
                <div className={styles.label_title}>Recent</div>
            </div>
            <div className={styles.content}>
                {aRecent.length > 0 ? (
                    <>
                        {aRecent.map((item, index) => {
                            return (
                                <div className={styles.recent} key={index}>
                                    <div className={styles.menu}>
                                        <MoreVertOutlinedIcon fontSize="large" className={styles.recent_icon_menu} />
                                    </div>
                                    <div className={styles.recent_title}>
                                        Name: <span className={styles.recent_name}>{item.title}</span>
                                    </div>
                                    <div className={styles.recent_title}>Last updated:</div>
                                    <div className={styles.recent_last_update}>{item.lastUpdate}</div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className={styles.no_recent}>You don't have recent form.</div>
                )}
            </div>
        </div>
    );
};

export default Form;
