import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps, 
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  isPassword = false,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        error && styles.inputError,
        isDark && styles.inputContainerDark
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            isDark && styles.inputDark
          ]}
          placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity style={styles.rightIcon} onPress={toggleSecureEntry}>
            {secureTextEntry ? 
              <Eye size={20} color={isDark ? '#8E8E93' : '#8E8E93'} /> : 
              <EyeOff size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
            }
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000000',
  },
  labelDark: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
  },
  inputContainerDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});