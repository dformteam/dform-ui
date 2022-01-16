import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import styles from './MyForm.module.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useSelector } from 'react-redux';

const MyForm = () => {
    const raws = [];
    const wallet = useSelector((state) => state.wallet);
    const aNav = [
        { id: 'all-form', label: 'All Form', icon: null },
        { id: 'share-with-me', label: 'Share With Me', icon: null },
        { id: 'favorites', label: 'Favorites', icon: FavoriteOutlinedIcon },
    ];

    const headers = ['Form name', 'Submissions', 'Type', 'Created at', 'status'];
    const [rows, setRows] = useState([
        // { id: 1, formName: 'Form name 1', submission: 5, create: 'Nov 11 2021' },
        // { id: 2, formName: 'Form name 2', submission: 5, create: 'Nov 11 2021' },
        // { id: 3, formName: 'Form name 3', submission: 5, create: 'Nov 11 2021' },
        // { id: 4, formName: 'Form name 1', submission: 5, create: 'Nov 11 2021' },
        // { id: 5, formName: 'Form name 2', submission: 5, create: 'Nov 11 2021' },
        // { id: 6, formName: 'Form name 3', submission: 5, create: 'Nov 11 2021' },
    ]);
    const [aRowSelected, setRowSelected] = useState([]);
    const [aRowFavorite, setRowFavorite] = useState([]);

    useLayoutEffect(() => {
        onGetMaxRows();
    }, []);

    const onGetMaxRows = () => {
        const { contract, walletConnection } = wallet;
        const userId = walletConnection.getAccountId();
        contract
            ?.get_form_count?.({
                userId: userId,
            })
            .then((total) => {
                onGetRows({ total });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetRows = ({ total }) => {
        const { contract, walletConnection } = wallet;
        const num_page = parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        setRows([]);
        const userId = walletConnection.getAccountId();
        page_arr.map((page, index) => {
            contract
                .get_forms({
                    userId,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        console.log(data);
                        const pIndex = raws.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            raws.push(data);
                            raws.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let forms = [];
                            raws.map((raw) => {
                                forms = [...forms, ...(raw?.data || [])];
                            });
                            setRows([...forms]);
                        }
                    }
                });
        });
    };

    const onEditForm = (item) => {
        console.log(item);
    };

    const onDeleteForm = (item) => {
        const { contract } = wallet;
        contract
            ?.delete_form?.({
                id: item?.id,
            })
            .then((ret) => {
                if (ret) {
                    onGetMaxRows();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onSelectRow = (row, index) => {
        let copyRows = [...rows];
        copyRows[index].select = !row.select;
        setRows(copyRows);
        if (row.select) {
            let copyRowsSelected = [...aRowSelected];
            copyRowsSelected.push(row);
            setRowSelected(copyRowsSelected);
        } else {
            let copyRowsSelected = [...aRowSelected];
            copyRowsSelected.map((item, index) => {
                if (item.id === row.id) {
                    copyRowsSelected.splice(index, 1);
                }
            });
            setRowSelected(copyRowsSelected);
        }
    };

    const onAddFavorite = (row, index) => {
        let copyRows = [...rows];
        copyRows[index].favorite = !row.favorite;
        setRows(copyRows);
        if (row.favorite) {
            let copyRowsFavorite = [...aRowFavorite];
            copyRowsFavorite.push(row);
            setRowFavorite(copyRowsFavorite);
        } else {
            let copyRowsFavorite = [...aRowFavorite];
            copyRowsFavorite.map((item, index) => {
                if (item.id === row.id) {
                    copyRowsFavorite.splice(index, 1);
                }
            });
            setRowFavorite(copyRowsFavorite);
        }
    };

    const onSelectAllRow = (val) => {
        let copyRows = [...rows];
        for (let i = 0; i < copyRows.length; i++) {
            copyRows[i].select = val;
        }
        setRows(copyRows);
        if (val) {
            setRowSelected([...rows]);
        } else {
            setRowSelected([]);
        }
    };

    const onAddAllFavorite = (val) => {
        let copyRows = [...rows];
        copyRows.map((item) => {
            item.favorite = val;
        });
        setRows(copyRows);
        if (val) {
            setRowFavorite([...rows]);
        } else {
            setRowFavorite([]);
        }
    };

    const onExportDateTime = (datetime) => {
        try {
            const timestamp = parseFloat(datetime);
            const date = new Date(timestamp);
            const localDate = date.toLocaleDateString();
            const localTime = date.toLocaleTimeString();
            return `${localDate} ${localTime}`;
        } catch {
            return 'unknow';
        }
    };

    const onExportFormStatus = (item) => {
        const { status, start_date, end_date } = item;
        const cTimestamp = Date.now();
        if (status === 0) {
            return 'Editable';
        }
        if (status === 1 && cTimestamp < start_date) {
            return 'Waiting for publish';
        }
        if (status === 1 && cTimestamp > start_date && cTimestamp < end_date) {
            return 'Publishing';
        }
        if ((status === 1 && cTimestamp > end_date) || status === 2) {
            return 'Finished';
        }
    };

    const onExportFormType = (type) => {};

    return (
        <div className={styles.root}>
            <div className={styles.nav}>
                <div className={styles.nav_title}>My Forms</div>
                {aNav.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <div className={styles.nav_label}>
                                {item.icon && <item.icon className={styles.nav_icon} />}
                                {item.label}
                            </div>
                            <div className={styles.line} />
                        </Fragment>
                    );
                })}
            </div>
            <div className={styles.content}>
                <div className={styles.content_row}>
                    <button className={styles.content_button + ' ' + `${aRowSelected.length !== 1 && styles.disabled}`} disabled={aRowSelected.length !== 1}>
                        Analysis
                    </button>
                    <button
                        className={styles.content_button_delete + ' ' + `${aRowSelected.length === 0 && styles.disabled}`}
                        disabled={aRowSelected.length === 0}
                    >
                        Delete Selected
                    </button>
                </div>
                <div className={styles.line} />
                <div className={styles.table}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.cell_select_area}>
                                    {aRowSelected.length === rows.length ? (
                                        <CheckBoxIcon className={styles.table_icon_select} onClick={() => onSelectAllRow(false)} />
                                    ) : (
                                        <CheckBoxOutlineBlankIcon className={styles.table_icon_select} onClick={() => onSelectAllRow(true)} />
                                    )}
                                    {aRowFavorite.length === rows.length ? (
                                        <FavoriteOutlinedIcon className={styles.table_icon_favor} onClick={() => onAddAllFavorite(false)} />
                                    ) : (
                                        <FavoriteBorderOutlinedIcon className={styles.table_icon_favor} onClick={() => onAddAllFavorite(true)} />
                                    )}
                                </TableCell>
                                {headers.map((header, index) => (
                                    <TableCell align="left" key={index} className={styles.table_title}>
                                        {header.toUpperCase()}
                                    </TableCell>
                                ))}
                                <TableCell className={styles.table_title}>{'ACTIONS'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.map?.((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className={styles.cell_select_area}>
                                        <span onClick={() => onSelectRow(item, index)}>
                                            {item.select ? (
                                                <CheckBoxIcon className={styles.table_icon_select} />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon className={styles.table_icon_select} />
                                            )}
                                        </span>
                                        <span onClick={() => onAddFavorite(item, index)}>
                                            {item.favorite ? (
                                                <FavoriteOutlinedIcon className={styles.table_icon_favor} />
                                            ) : (
                                                <FavoriteBorderOutlinedIcon className={styles.table_icon_favor} />
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className={styles.cell}>{item.title}</TableCell>
                                    <TableCell className={styles.cell}>{item.participants?.length}</TableCell>
                                    <TableCell className={styles.cell}>{item.type === 0 ? 'Basic' : 'Card'}</TableCell>
                                    <TableCell className={styles.cell}>{onExportDateTime(item.created_at)}</TableCell>
                                    <TableCell className={styles.cell}>{onExportFormStatus(item)}</TableCell>
                                    <TableCell className={styles.cell_action}>
                                        <button className={styles.table_button_edit} onClick={() => onEditForm(item)}>
                                            Edit Form
                                        </button>
                                        <button className={styles.table_button_delete} onClick={() => onDeleteForm(item)}>
                                            Delete Form
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default MyForm;
