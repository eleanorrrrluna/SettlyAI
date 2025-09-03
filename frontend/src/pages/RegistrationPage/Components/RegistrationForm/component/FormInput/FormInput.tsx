import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, type Control, type RegisterOptions } from 'react-hook-form';

interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions;
  trigger?: (name: any) => Promise<boolean>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const FormInput = ({ name, control, rules, helperText, trigger, ...props }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...props}
          {...field}
          onChange={async e => {
            field.onChange(e);
            // 如果有错误，立即重新验证
            if (error && trigger) {
              await trigger(name);
            }
          }}
          onBlur={e => {
            field.onBlur();
            console.log('onBlur triggered:', e.target.value);
            console.log('Current error:', error);
          }}
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          error={!!error}
          helperText={error ? error.message : helperText}
        />
      )}
    />
  );
};
