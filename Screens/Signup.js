import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { signupUser } from '../BackendServices/Apiservices';

const primaryColor = '#FF385C';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const { username, email, password, confirmPassword } = formData;

    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await signupUser({
        fullname: username,
        email,
        password,
      });

      Alert.alert('Success', response.message || 'Account created!');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Signup Failed', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#FF385C', '#FF6B81']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Join Us</Text>
        <Text style={styles.headerSubtitle}>
          Create your account to get started
        </Text>
      </LinearGradient>

      {/* Card Section */}
      <View style={styles.card}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={formData.username}
          onChangeText={text => handleInputChange('username', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={text => handleInputChange('email', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.password}
          onChangeText={text => handleInputChange('password', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={text => handleInputChange('confirmPassword', text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#fff',
    marginTop: 8,
    opacity: 0.9,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  error: {
    color: '#E53935',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: primaryColor,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: primaryColor,
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  loginBold: {
    color: primaryColor,
    fontWeight: 'bold',
  },
});