import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { useTheme } from '@/presentation/shared/context/ThemeContext';

type FormInputProps<T> = {
  control: Control<T>;
  name: keyof T;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  errors: FieldErrors<T>;
  containerClassName?: string;
  inputClassName?: string;
};

export default function FormInput<T>({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  errors,
  containerClassName = 'mb-6',
  inputClassName = '',
}: FormInputProps<T>) {
  const { theme } = useTheme();

  const baseInputClass =
    'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-primary focus:bg-white dark:focus:bg-slate-800';

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field: { onChange, value } }) => (
        <View className={containerClassName}>
          <TextInput
            className={`${baseInputClass} ${inputClassName}`}
            placeholder={placeholder}
            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
            value={value as string}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize="none"
          />
          {errors[name] && (
            <Text className="text-red-500 text-sm mt-1">
              {errors[name]?.message as string}
            </Text>
          )}
        </View>
      )}
    />
  );
}
