import { FormPageContainer } from '../../components/FormPageContainer';
import { FormContainer } from './component/FormContainer';
import { Typography, TextField, CircularProgress } from '@mui/material';
import GlobalButton from '@/components/GlobalButton';
import { TextButton } from './component/TextButton';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { useState, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { verifyEmail, resendVerificationCode } from '@/api/authApi';
import type { IVerifyEmailRequest } from '@/interfaces/user';
import { z } from 'zod';

const verificationCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Verification code must be 6 digits');

export const VerificationPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');

  // 验证邮箱mutation
  const verifyMutation = useMutation<
    { success: boolean; message?: string },
    AxiosError,
    IVerifyEmailRequest
  >({
    mutationFn: verifyEmail,
    onSuccess: () => {
      navigate('/dashboard'); // 验证成功后跳转到仪表板或登录页
    },
    onError: () => {
      // React Query会自动管理error状态
    },
  });

  // 重新发送验证码mutation
  const resendMutation = useMutation<
    { success: boolean; message?: string },
    AxiosError,
    number
  >({
    mutationFn: resendVerificationCode,
    onSuccess: () => {
      // 可以显示成功消息
    },
    onError: () => {
      // React Query会自动管理error状态
    },
  });

  const handleVerificationCodeChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(event.target.value);
  };

  const handleVerificationCodeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const result = verificationCodeSchema.safeParse(verificationCode);
    if (!result.success || !userId) {
      return;
    }

    verifyMutation.mutate({
      userId: parseInt(userId, 10),
      code: result.data,
      verificationType: 1, // 邮箱验证类型
    });
  };

  const handleResendCode = () => {
    if (!userId) return;
    resendMutation.mutate(parseInt(userId, 10));
  };

  // 获取错误信息的helper函数
  const getErrorMessage = () => {
    if (verifyMutation.error) {
      return verifyMutation.error.response?.status === 400 
        ? 'Invalid or expired verification code'
        : 'Verification failed. Please try again.';
    }
    if (resendMutation.error) {
      return 'Failed to resend verification code';
    }
    const result = verificationCodeSchema.safeParse(verificationCode);
    if (verificationCode && !result.success) {
      return 'Verification code must be 6 digits';
    }
    if (!userId) {
      return 'User ID is missing';
    }
    return null;
  };
  return (
    <FormPageContainer>
      <FormContainer
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleVerificationCodeSubmit}
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
        
        {/* 错误信息显示 */}
        {getErrorMessage() && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {getErrorMessage()}
          </Typography>
        )}
        
        <TextField
          value={verificationCode}
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          label="Verification code*"
          disabled={verifyMutation.isPending}
          slotProps={{
            inputLabel: {
              sx: theme => ({
                ...theme.typography.body2,
                color: 'grey.500',
              }),
            },
            input: {
              startAdornment: <LockOutlined fontSize="small" color="action" />,
            },
          }}
          onChange={handleVerificationCodeChange}
        />
        
        <GlobalButton
          type="submit"
          width="full"
          height="50"
          color="primary"
          variant="contained"
          disabled={verifyMutation.isPending}
          sx={{ mt: 3 }}
        >
          {verifyMutation.isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Continue'
          )}
        </GlobalButton>
        
        <Typography variant="p1" component="p" textAlign="center" marginTop={6}>
          Can&apos;t find it? Check your spam folder.{'  '}
          <TextButton 
            onClick={handleResendCode}
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend'}
          </TextButton>
        </Typography>
      </FormContainer>
    </FormPageContainer>
  );
};
