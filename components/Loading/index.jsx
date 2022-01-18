import React from 'react';
import Backdrop from '@mui/material/Backdrop';

export default function Loading(props) {
    const { open } = props;
    return (
        <Backdrop sx={{ color: '#fff', zIndex: 999 }} open={open}>
            <img src={'/loadingWhite.svg'} style={{ width: 100, height: 100 }} />
        </Backdrop>
    );
}
