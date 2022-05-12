import styles from './Sent.module.scss';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/router';

const Sent = () => {
    const router = useRouter();

    const handleClick = (event, item) => {
        console.log(item);
        router.push(`/message/sent/${item.id}`);
    };

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.header_title}>Sent Items</div>
            </div>
            <div className={styles.table}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 226px)' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.table_title}>{'FROM'}</TableCell>
                                <TableCell className={styles.table_title}>{'SUBJECT'}</TableCell>
                                <TableCell className={styles.table_title}>{'RECEIVED'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aMessage?.map?.((item, index) => (
                                <TableRow
                                    hover
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                    onClick={(event) => handleClick(event, item)}
                                >
                                    <TableCell>
                                        <span>{item.from}</span>
                                    </TableCell>
                                    <TableCell>{item.subject}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Sent;

const aMessage = [
    {
        id: 1,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 2,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 3,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 4,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 5,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 6,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 7,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 8,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
    {
        id: 9,
        from: 'haducanh94@mail.com',
        subject: '[Action required] Verify your TeamViewer account',
        content: '[Action required] Verify your TeamViewer account',
        date: '10/28/2021',
    },
];
