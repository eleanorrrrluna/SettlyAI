import { FormPageContainer } from '../../components/FormPageContainer';
import { FormContainer } from './component/FormContainer';
import { Typography, TextField } from '@mui/material';
import GlobalButton from '@/components/GlobalButton';
import { TextButton } from './component/TextButton';
import LockOutlined from '@mui/icons-material/LockOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';

export const VerificationPage = () => {
  return (
    <FormPageContainer>
      <FormContainer
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={() => {}} // TODO: Add form submission logic
      >
        <Typography variant="h4" component="h3" marginBottom={4}>
          Check your email for a code
        </Typography>
        <Typography
          variant="body2"
          component="p"
          marginBottom={6}
          textAlign="center"
        >
          Check your inbox for a 6-digit code and enter it below.
        </Typography>
        <TextField fullWidth size="small" margin="normal" variant="outlined" />
        <TextField
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          label="Verification code*"
          slotProps={{
            inputLabel: {
              sx: theme => ({
                ...theme.typography.body2, // 包含 fontSize / fontWeight / lineHeight 等
                color: 'grey.500',
              }),
            },
            input: {
              startAdornment: <LockOutlined fontSize="small" color="action" />,
            },
          }}
        />
        <GlobalButton
          type="submit"
          width="full"
          height="50"
          color="primary"
          variant="contained"
          sx={{ mt: 3 }}
        >
          Continue
        </GlobalButton>
        <Typography variant="p1" component="p" textAlign="center" marginTop={6}>
          Can&apos;t find it? Check your spam folder.{'  '}
          <TextButton>Resend</TextButton>
        </Typography>
      </FormContainer>
    </FormPageContainer>
  );
};
