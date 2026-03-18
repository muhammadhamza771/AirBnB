import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../BackendServices/Apiservices';

const primaryColor = '#FF385C';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Please enter email and password');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await loginUser(formData);

      if (response && response.success && response.user) {
        login(response);

        navigation.reset({
          index: 0,
          routes: [{ name: 'GuestTab' }],
        });
      } else {
        setErrorMessage(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';

      setErrorMessage(errorMsg);
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FF385C', '#FF6B81']} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back 👋</Text>
          <Text style={styles.headerSubtitle}>
            Login to continue your journey
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Icon name="mail-outline" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginBottom: 15 }}
            disabled={loading}
          >
            <Text style={{ color: primaryColor, fontWeight: '600' }}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Error */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {/* Divider */}
          <Text style={styles.orText}>OR</Text>

          {/* Signup */}
          <View style={styles.signupRow}>
            <Text style={{ color: '#777' }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: '#222',
    fontSize: 15,
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 5,
    shadowColor: primaryColor,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#E53935',
    textAlign: 'center',
    marginTop: 12,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#777',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: primaryColor,
    fontWeight: 'bold',
  },
});