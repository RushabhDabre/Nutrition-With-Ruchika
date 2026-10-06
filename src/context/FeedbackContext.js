import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const FeedbackContext = createContext(null);

export const useFeedback = () => useContext(FeedbackContext);

export function FeedbackProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    message: '',
    type: 'warning', // 'warning', 'error', 'info', 'success'
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
  });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        title: options.title || 'Are you sure?',
        message: options.message || '',
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Yes',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  const handleConfirmClose = (confirmed) => {
    setConfirmState((prev) => ({ ...prev, open: false }));
    if (confirmed && confirmState.onConfirm) {
      confirmState.onConfirm();
    } else if (!confirmed && confirmState.onCancel) {
      confirmState.onCancel();
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 56, mb: 1.5 }} />;
      case 'error': return <ErrorOutlineRoundedIcon color="error" sx={{ fontSize: 56, mb: 1.5 }} />;
      case 'success': return <CheckCircleOutlineRoundedIcon color="success" sx={{ fontSize: 56, mb: 1.5 }} />;
      default: return null;
    }
  };

  return (
    <FeedbackContext.Provider value={{ showSnackbar, showConfirm }}>
      {children}
      
      {/* Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Global Confirm/Warning Dialog */}
      <Dialog 
        open={confirmState.open} 
        onClose={() => handleConfirmClose(false)}
        PaperProps={{ sx: { borderRadius: 4, minWidth: 320, maxWidth: 400, textAlign: 'center', p: 1.5 } }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            {getIcon(confirmState.type)}
            <Typography variant="h6" fontWeight="800" gutterBottom sx={{ mt: 1 }}>
              {confirmState.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {confirmState.message}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1, gap: 1 }}>
          <Button onClick={() => handleConfirmClose(false)} color="inherit" sx={{ px: 3, borderRadius: 2 }}>
            {confirmState.cancelText}
          </Button>
          <Button 
            onClick={() => handleConfirmClose(true)} 
            variant="contained" 
            color={confirmState.type === 'error' ? 'error' : confirmState.type === 'warning' ? 'warning' : 'primary'}
            sx={{ px: 4, borderRadius: 2 }}
            disableElevation
          >
            {confirmState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>

    </FeedbackContext.Provider>
  );
}
