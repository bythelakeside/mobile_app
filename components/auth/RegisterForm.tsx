import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock } from 'lucide-react-native';

interface RegisterFormProps {
  onRegister: (email: string, password: string) => Promise<void>;
  onLogin: () => void;
  error: string | null;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onLogin,
  error,
  isLoading,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const validate = () => {
    let isValid = true;
    const errors = { email: '', password: '', confirmPassword: '' };

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validate()) {
      await onRegister(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDark && styles.textDark]}>Create Account</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Sign up to start taking notes
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={formErrors.email}
          leftIcon={<Mail size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />}
        />

        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          isPassword
          error={formErrors.password}
          leftIcon={<Lock size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          error={formErrors.confirmPassword}
          leftIcon={<Lock size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />}
        />

        <Button
          title="Sign Up"
          onPress={handleRegister}
          isLoading={isLoading}
          style={styles.button}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={onLogin}>
          <Text style={styles.linkText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  subtitleDark: {
    color: '#98989D',
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#8E8E93',
    marginRight: 4,
  },
  footerTextDark: {
    color: '#98989D',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
});