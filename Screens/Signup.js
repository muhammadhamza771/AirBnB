import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signupUser } from '../BackendServices/Apiservices'; // API file

const primaryColor = '#FF385C';
const textColor = '#222222';
const subtitleColor = '#717171';
const borderColor = '#DDDDDD';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
   
  });

  const [allFieldError, setAllFieldError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Signup button
  const handleSignup = async () => {
    setAllFieldError('');
    setEmailError('');
    setPasswordError('');

    const { username, email, password, confirmPassword } = formData;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setAllFieldError('Please fill all fields');
      return;
    }

    // Gmail validation
    const emailRegex = /^[a-zA-Z0-9._]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid Gmail address');
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

const response = await signupUser({
  fullname: formData.username,
  email: formData.email,
  password: formData.password,   
});
      Alert.alert('Success', response.message || 'Account created successfully');

      navigation.replace('Login');
    } catch (error) {
      console.log('Full Error:', error);

      if (error.response) {
        // Backend error
        Alert.alert(
          'Signup Failed',
          error.response.data?.message || 'Server error'
        );
      } else if (error.request) {
        // Network error
        Alert.alert(
          'Network Error',
          'Cannot connect to server. Check IP & WiFi.'
        );
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {allFieldError ? <Text style={styles.error}>{allFieldError}</Text> : null}

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.username}
        onChangeText={text => handleInputChange('username', text)}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={text => handleInputChange('email', text)}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={text => handleInputChange('password', text)}
      />

      {/* Confirm Password */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={text => handleInputChange('confirmPassword', text)}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Login link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginBold}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: borderColor,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
    color: textColor,
  },
  error: {
    color: '#E53935',
    marginBottom: 10,
    fontSize: 13,
  },
  button: {
    backgroundColor: primaryColor,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: subtitleColor,
  },
  loginBold: {
    color: primaryColor,
    fontWeight: '700',
  },
});