import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const primaryColor = '#FF385C';
const textColor = '#222222';
const subtitleColor = '#717171';
const borderColor = '#DDDDDD';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [allFieldError, setAllFieldError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignup = () => {
    setAllFieldError('');
    setEmailError('');
    setPasswordError('');

    if (!username || !email || !password || !confirmPassword) {
      setAllFieldError('Please fill all fields');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid Gmail address');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    Alert.alert('Success', 'Account created successfully');
  
  navigation.replace('GuestTabs');
};

  

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Airbnb</Text>
          <Text style={styles.tagline}>
            Book unique homes & experiences
          </Text>
        </View>

        <Text style={styles.title}>Create your account</Text>

        {allFieldError ? (
          <Text style={styles.error}>{allFieldError}</Text>
        ) : null}

        {/* Username */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        {/* Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}

        {/* Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSignup}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          By signing up, you agree to our{' '}
          <Text style={styles.link}>Terms</Text> &{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

        <View style={styles.divider} />

        {/* Login */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginBold}>Log in</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 34,
    fontWeight: '900',
    color: primaryColor,
  },
  tagline: {
    fontSize: 14,
    color: subtitleColor,
    marginTop: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: textColor,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  input: {
    height: 52,
    fontSize: 16,
    color: textColor,
  },
  error: {
    color: '#E53935',
    fontSize: 13,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: primaryColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  terms: {
    fontSize: 12,
    color: subtitleColor,
    textAlign: 'center',
    marginTop: 16,
  },
  link: {
    color: primaryColor,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  loginText: {
    textAlign: 'center',
    fontSize: 15,
    color: subtitleColor,
  },
  loginBold: {
    color: primaryColor,
    fontWeight: '700',
  },
});
