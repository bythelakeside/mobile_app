import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, Fingerprint } from 'lucide-react-native';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: () => void;
  onGuest: () => void;
  onBiometricLogin: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
  biometricsAvailable: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onRegister,
  onGuest,
  onBiometricLogin,
  error,
  isLoading,
  biometricsAvailable,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const validate = () => {
    let isValid = true;
    const errors = { email: '', password: '' };

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

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validate()) {
      await onLogin(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDark && styles.textDark]}>Welcome Back</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Sign in to access your notes
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
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          isPassword
          error={formErrors.password}
          leftIcon={<Lock size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />}
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          isLoading={isLoading}
          style={styles.button}
        />
        
        {biometricsAvailable && Platform.OS !== 'web' && (
          <Button
            title="Sign In with Biometrics"
            variant="outline"
            onPress={onBiometricLogin}
            leftIcon={<Fingerprint size={20} color={isDark ? '#FFFFFF' : '#000000'} />}
            style={styles.biometricButton}
          />
        )}

        <Button
          title="Continue as Guest"
          variant="secondary"
          onPress={onGuest}
          style={styles.guestButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.linkText}>Sign Up</Text>
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
  biometricButton: {
    marginTop: 12,
  },
  guestButton: {
    marginTop: 12,
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