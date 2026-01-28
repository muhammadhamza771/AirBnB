import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const primaryColor = '#FF385C';
const textColor = '#222222';
const subtitleColor = '#717171';
const borderColor = '#DDDDDD';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      return;
    }

    // clear error
    setErrorMessage('');

    // TODO: API login here later

    
    navigation.replace('GuestTab');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome Back</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Login to your account</Text>
        <Text style={styles.subtitle}>
          Enter your credentials to continue
        </Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Forgot */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        {/* Error */}
        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : null}

        {/* OR */}
        <Text style={styles.orText}>OR</Text>

        {/* Signup */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpPrompt}>
            Don’t have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backArrow: {
    fontSize: 26,
    color: '#FFF',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: textColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: subtitleColor,
    marginBottom: 24,
  },



 
  inputContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    height: 52,
    fontSize: 16,
    color: textColor,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: primaryColor,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: primaryColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#E53935',
    textAlign: 'center',
    marginTop: 10,
  },
  orText: {
    textAlign: 'center',
    color: subtitleColor,
    marginVertical: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpPrompt: {
    color: subtitleColor,
    fontSize: 16,
  },
  signupText: {
    color: primaryColor,
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 16,
  },
});
