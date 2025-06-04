import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: isDark ? '#0A84FF' : '#007AFF',
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
          },
          text: {
            color: isDark ? '#FFFFFF' : '#000000',
          },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: isDark ? '#636366' : '#8E8E93',
          },
          text: {
            color: isDark ? '#FFFFFF' : '#000000',
          },
        };
      case 'danger':
        return {
          button: {
            backgroundColor: isDark ? '#FF453A' : '#FF3B30',
          },
          text: {
            color: '#FFFFFF',
          },
        };
      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          button: {
            paddingVertical: 8,
            paddingHorizontal: 12,
          },
          text: {
            fontSize: 12,
          },
        };
      case 'medium':
        return {
          button: {
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
          text: {
            fontSize: 16,
          },
        };
      case 'large':
        return {
          button: {
            paddingVertical: 16,
            paddingHorizontal: 24,
          },
          text: {
            fontSize: 18,
          },
        };
      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyle.button,
        sizeStyle.button,
        props.disabled && styles.disabled,
        style,
      ]}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? (isDark ? '#FFFFFF' : '#000000') : '#FFFFFF'} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text 
            style={[
              styles.text, 
              variantStyle.text, 
              sizeStyle.text,
              textStyle
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});