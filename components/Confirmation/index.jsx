import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default ({ label = {}, onAccept, onCancel }) => {
    const handleAccept = () => {
        onAccept?.();
    };

    return (
        <>
            <Dialog open={true} aria-labelledby="draggable-dialog-title">
                <DialogTitle>{label.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{label.desc}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>{label.cancel}</Button>
                    <Button onClick={handleAccept}>{label.accept}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
