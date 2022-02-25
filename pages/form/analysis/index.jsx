import { useState } from 'react';
import styles from './Analysis.module.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Analysis = () => {
    const headers = ['Participant', 'Submissions date', 'Type', 'Created at', 'status'];
    const [rows, setRows] = useState([
        { participants: 'Participant 1', submissions_date: 'Submissions date', type: 'Type', created_at: 'Created at', status: 'status' },
    ]);

    return (
        <div className={styles.root}>
            <button className={styles.export}>Export</button>
            <div className={styles.content}>
                <div className={styles.table}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headers.map((header, index) => (
                                    <TableCell align="left" key={index} className={styles.table_title}>
                                        {header.toUpperCase()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.map?.((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className={styles.cell_title}>{item.participants}</TableCell>
                                    <TableCell className={styles.cell}>{item.submissions_date}</TableCell>
                                    <TableCell className={styles.cell}>{item.type}</TableCell>
                                    <TableCell className={styles.cell}>{item.created_at}</TableCell>
                                    <TableCell className={styles.cell}>{item.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
