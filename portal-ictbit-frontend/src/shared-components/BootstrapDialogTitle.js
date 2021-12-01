import { Button, DialogTitle, Typography, Box } from '@material-ui/core';
import PropTypes from 'prop-types';

import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';

const BootstrapDialogTitle = (props) => {
  const { children, onClose, isBudgetRequests, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      {...other}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        direction: 'rtl',
        // sticky
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        background: 'white',
        boxShadow: '0px 0px 1px 1px #aaaaaa',
      }}>
      <span
        style={{
          alignSelf: 'center',
          fontSize: 24,
          fontWeight: 700,
        }}>
        {children}
        <div dir='rtl'>
          <Typography variant='subtitle2' gutterBottom>
            {isBudgetRequests ? (
              <Box style={{ fontSize: 16, paddingBottom: 5, paddingRight: 2 }}>
                מלא את השדות מטה כדי ליצור בקשה חדשה / לעדכן בקשה קיימת ולשלוח
                אותה לאישור
              </Box>
            ) : (
              <Box
                style={{
                  fontSize: 16,
                  paddingBottom: 5,
                  paddingRight: 2,
                }}>
                מלא את השדות מטה כדי ליצור בקשה לשינוי תקציב חדשה ולשלוח אותה
                לאישור
              </Box>
            )}
          </Typography>
        </div>
      </span>

      {!!onClose && (
        <Button
          aria-label='close'
          onClick={onClose}
          sx={{
            // position: 'absolute',
            // right: 8,
            // top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseTwoToneIcon />
        </Button>
      )}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  isBudgetRequests: PropTypes.bool,
};

export default BootstrapDialogTitle;
