import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { 
  getUserById, 
  updateUser, 
  getFamilyMembersByUserId,
  addFamilyMember as apiAddFamilyMember, 
  updateFamilyMember as apiUpdateFamilyMember, 
  deleteFamilyMember as apiDeleteFamilyMember 
} from '../../BackendServices/Apiservices';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  // ==================== STATE VARIABLES ====================
  const [isEditing, setIsEditing] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isHabitOpen, setIsHabitOpen] = useState(false);
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Image states
  const [profileImage, setProfileImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);

  // Main form data
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    gender: '',
    address: '',
    role: 'guest',
    verification_status: 'pending',
    bio: '',
    habbits: [],
    family_members: [],
  });

  // For cancel button
  const [originalData, setOriginalData] = useState({});

  // New habit input
  const [newHabbit, setNewHabbit] = useState('');

  // New family member form
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    bio: ''
  });

  const navigation = useNavigation();
  
  // Get user from AuthContext
  const context = useContext(AuthContext) || {};
  const { 
    logout = () => {}, 
    isHost = false, 
    switchToHost = () => {}, 
    switchToGuest = () => {},
    user = null 
  } = context;

  // ==================== HELPER FUNCTIONS ====================

  const showError = (error) => {
    let message = "Something went wrong";
    
    if (error.response && error.response.data) {
      const data = error.response.data;
      
      if (data.detail && Array.isArray(data.detail)) {
        const firstError = data.detail[0];
        message = firstError.msg || firstError.message || JSON.stringify(firstError);
      } 
      else if (data.detail) {
        message = data.detail;
      }
      else if (data.message && Array.isArray(data.message)) {
        message = data.message[0];
      }
      else if (data.message) {
        message = data.message;
      }
    } else if (error.message) {
      message = error.message;
    }
    
    Alert.alert("Error", message);
  };

  const showSuccess = (msg) => {
    Alert.alert("Success", msg);
  };

  // ==================== DATA FETCHING ====================

  useEffect(() => {
    if (user && user.id) {
      fetchUserData(user.id);
      fetchFamilyMembers(user.id);
    } else {
      setInitialLoading(false);
    }
  }, [user]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserById(userId);
      
      if (response && response.success && response.data) {
        const userData = response.data;
        
        setFormData(prev => ({
          ...prev,
          fullname: userData.fullname || '',
          email: userData.email || '',
          phonenumber: userData.phonenumber ? String(userData.phonenumber) : '',
          gender: userData.gender || '',
          address: userData.full_address || '',
          role: userData.role || 'guest',
          verification_status: userData.verification_status || 'pending',
          bio: userData.bio || '',
          habbits: userData.habbits || [],
        }));
        
        setOriginalData({
          fullname: userData.fullname || '',
          email: userData.email || '',
          phonenumber: userData.phonenumber ? String(userData.phonenumber) : '',
          gender: userData.gender || '',
          address: userData.full_address || '',
          role: userData.role || 'guest',
          verification_status: userData.verification_status || 'pending',
          bio: userData.bio || '',
          habbits: userData.habbits || [],
          family_members: formData.family_members,
        });
        
        if (userData.profile_picture) {
          setProfileImage(userData.profile_picture);
        }
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyMembers = async (userId) => {
    try {
      const response = await getFamilyMembersByUserId(userId);
      if (response) {
        setFormData(prev => ({
          ...prev,
          family_members: response
        }));
      }
    } catch (error) {
      console.log('Error fetching family members:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  // ==================== PROFILE UPDATE ====================

  const handleUpdateUser = async () => {
    if (!user || !user.id) return;
    
    try {
      setSaving(true);
      
      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
        phonenumber: formData.phonenumber ? String(formData.phonenumber) : null,
        gender: formData.gender,
        full_address: formData.address,
        bio: formData.bio,
        habbits: formData.habbits,
      };
      
      const response = await updateUser(user.id, updateData, newProfileImage);
      
      if (response && response.success) {
        showSuccess("Profile updated successfully");
        
        if (response.data && response.data.profile_picture) {
          setProfileImage(response.data.profile_picture);
        }
        
        setNewProfileImage(null);
        setIsEditing(false);
        setOriginalData(formData);
      }
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(originalData);
    setNewProfileImage(null);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ==================== PROFILE PICTURE ====================

  const openProfileCamera = () => {
    Alert.alert(
      "Profile Picture",
      "Choose option",
      [
        {
          text: "Camera",
          onPress: async () => {
            try {
              const result = await launchCamera({ 
                mediaType: 'photo',
                quality: 0.8,
              });
              
              if (result.assets && result.assets[0]) {
                setNewProfileImage(result.assets[0].uri);
                if (!isEditing) {
                  Alert.alert('Info', 'Please click Edit button to save');
                }
              }
            } catch (error) {
              Alert.alert('Error', 'Could not open camera');
            }
          }
        },
        {
          text: "Gallery",
          onPress: async () => {
            try {
              const result = await launchImageLibrary({ 
                mediaType: 'photo',
                quality: 0.8,
              });
              
              if (result.assets && result.assets[0]) {
                setNewProfileImage(result.assets[0].uri);
                if (!isEditing) {
                  Alert.alert('Info', 'Please click Edit button to save');
                }
              }
            } catch (error) {
              Alert.alert('Error', 'Could not open gallery');
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  // ==================== HABITS ====================

  const addHabbit = () => {
    if (newHabbit.trim()) {
      setFormData(prev => ({
        ...prev,
        habbits: [...prev.habbits, newHabbit]
      }));
      setNewHabbit('');
    }
  };

  const removeHabbit = (index) => {
    setFormData(prev => ({
      ...prev,
      habbits: prev.habbits.filter((_, i) => i !== index)
    }));
  };

  // ==================== FAMILY MEMBERS ====================

  const openAddFamilyModal = () => {
    setEditingMemberIndex(null);
    setNewMember({
      name: '',
      relation: '',
      age: '',
      gender: '',
      email: '',
      phone: '',
      bio: ''
    });
    setIsFamilyModalOpen(true);
  };

  const openEditFamilyModal = (index) => {
    const member = formData.family_members[index];
    setEditingMemberIndex(index);
    setNewMember({
      name: member.fullname || '',
      relation: member.relation || '',
      age: member.age ? String(member.age) : '',
      gender: member.gender || '',
      email: member.email || '',
      phone: member.phonenumber ? String(member.phonenumber) : '',
      bio: member.bio || ''
    });
    setIsFamilyModalOpen(true);
  };

  const addFamilyMember = async () => {
    if (!newMember.name || !newMember.relation) {
      Alert.alert("Error", "Name and Relation are required");
      return;
    }

    try {
      setSaving(true);
      
      const memberData = {
        fullname: newMember.name,
        relation: newMember.relation,
        age: newMember.age ? parseInt(newMember.age) : null,
        gender: newMember.gender || null,
        email: newMember.email || null,
        phonenumber: newMember.phone ? String(newMember.phone) : null,
        bio: newMember.bio || null
      };

      if (editingMemberIndex !== null) {
        const memberId = formData.family_members[editingMemberIndex].id;
        
        if (!memberId) {
          Alert.alert("Error", "Member ID not found");
          return;
        }
        
        const response = await apiUpdateFamilyMember(memberId, memberData);
        
        if (response && response.success) {
          await fetchFamilyMembers(user.id);
          showSuccess("Family member updated successfully");
        } else {
          Alert.alert("Error", "Update failed");
        }
      } else {
        const response = await apiAddFamilyMember(user.id, memberData);
        
        if (response && response.success && response.data) {
          await fetchFamilyMembers(user.id);
          showSuccess("Family member added successfully");
        } else {
          Alert.alert("Error", "Add failed");
        }
      }

      setNewMember({ name: '', relation: '', age: '', gender: '', email: '', phone: '', bio: '' });
      setEditingMemberIndex(null);
      setIsFamilyModalOpen(false);
      
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  const removeFamilyMember = (index) => {
    const member = formData.family_members[index];
    
    if (!member.id) {
      Alert.alert("Error", "Member ID not found");
      return;
    }

    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${member.fullname || member.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              
              const response = await apiDeleteFamilyMember(member.id);
              
              if (response && response.success) {
                await fetchFamilyMembers(user.id);
                showSuccess("Family member removed");
              } else {
                Alert.alert("Error", "Failed to remove");
              }
            } catch (error) {
              showError(error);
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  // ==================== LOGOUT & SWITCH ====================

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }
      ]
    );
  };

  const handleSwitch = () => {
    try {
      if (isHost) {
        switchToGuest();
        navigation.reset({ index: 0, routes: [{ name: 'GuestTab' }] });
      } else {
        switchToHost();
        navigation.reset({ index: 0, routes: [{ name: 'HostTab' }] });
      }
    } catch (e) {
      Alert.alert("Error", "Could not switch role");
    }
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return '#4CAF50';
    if (status === 'rejected') return '#F44336';
    if (status === 'submitted') return '#FF9800';
    return '#9E9E9E';
  };

  // ==================== LOADING SCREENS ====================

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF385C" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInIcon}>👤</Text>
          <Text style={styles.notLoggedInTitle}>Not Logged In</Text>
          <Text style={styles.notLoggedInText}>Please login to view your profile</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerButtons}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={[styles.headerButton, styles.cancelButton]}
                onPress={handleCancelEdit}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, styles.saveButton]}
                onPress={handleUpdateUser}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                newProfileImage 
                  ? { uri: newProfileImage } 
                  : profileImage 
                    ? { uri: profileImage } 
                    : { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }
              }
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={openProfileCamera}
            >
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
            {newProfileImage && (
              <View style={styles.imagePendingBadge}>
                <Text style={styles.imagePendingText}>New</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.name}>{formData.fullname || 'User'}</Text>
          
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(formData.verification_status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(formData.verification_status) }]}>
              {formData.verification_status === 'approved' ? 'Verified' : 
               formData.verification_status === 'submitted' ? 'Under Review' : 'Not Verified'}
            </Text>
          </View>

          {formData.gender && (
            <View style={styles.genderBadge}>
              <Text style={styles.genderBadgeText}>👤 {formData.gender}</Text>
            </View>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
        </View>

        {/* Bio Section */}
        {(formData.bio || isEditing) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            {isEditing ? (
              <TextInput
                style={styles.bioInput}
                multiline
                placeholder="Tell us about yourself..."
                placeholderTextColor="#999"
                value={formData.bio}
                onChangeText={(text) => handleInputChange('bio', text)}
                editable={!saving}
              />
            ) : (
              <Text style={styles.bioText}>{formData.bio || 'No bio added yet'}</Text>
            )}
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          
          {isEditing ? (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fullname}
                  onChangeText={(text) => handleInputChange('fullname', text)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phonenumber}
                  onChangeText={(text) => handleInputChange('phonenumber', text)}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        formData.gender === gender && styles.genderOptionSelected
                      ]}
                      onPress={() => handleInputChange('gender', gender)}
                      disabled={saving}
                    >
                      <Text style={[
                        styles.genderText,
                        formData.gender === gender && styles.genderTextSelected
                      ]}>
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📧</Text>
                <Text style={styles.infoText}>{formData.email || 'No email'}</Text>
              </View>
              {formData.phonenumber && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📱</Text>
                  <Text style={styles.infoText}>{formData.phonenumber}</Text>
                </View>
              )}
              {formData.gender && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>👤</Text>
                  <Text style={styles.infoText}>{formData.gender}</Text>
                </View>
              )}
              {formData.address && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={styles.infoText}>{formData.address}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Verification Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Verification</Text>
            {formData.verification_status !== 'approved' && (
              <TouchableOpacity onPress={() => setIsVerifyModalOpen(true)}>
                <Text style={styles.verifyLink}>Verify Now</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.verificationItem}>
            <View style={styles.verificationLeft}>
              <Text style={styles.verificationIcon}>🆔</Text>
              <Text style={styles.verificationText}>Identity Document</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: getStatusColor(formData.verification_status) + '20' }]}>
              <Text style={[styles.statusPillText, { color: getStatusColor(formData.verification_status) }]}>
                {formData.verification_status === 'approved' ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Habits Section */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.cardHeader}
            onPress={() => setIsHabitOpen(!isHabitOpen)}
          >
            <Text style={styles.cardTitle}>Habits</Text>
            <Text style={styles.arrowIcon}>{isHabitOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isHabitOpen && (
            <View style={styles.expandedContent}>
              <View style={styles.habitsContainer}>
                {formData.habbits && formData.habbits.length > 0 ? (
                  formData.habbits.map((habbit, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.habitTag}
                      onPress={() => isEditing && !saving && removeHabbit(index)}
                      disabled={!isEditing || saving}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.habitText}>{habbit}</Text>
                      {isEditing && <Text style={styles.removeIcon}>✕</Text>}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No habits added yet</Text>
                )}
              </View>

              {isEditing && (
                <View style={styles.addHabitContainer}>
                  <TextInput
                    style={styles.habitInput}
                    placeholder="Add a new habit..."
                    placeholderTextColor="#999"
                    value={newHabbit}
                    onChangeText={setNewHabbit}
                    editable={!saving}
                  />
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={addHabbit}
                    disabled={saving}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Family Members Section */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.cardHeader}
            onPress={() => setIsFamilyOpen(!isFamilyOpen)}
          >
            <Text style={styles.cardTitle}>Family Members</Text>
            <Text style={styles.arrowIcon}>{isFamilyOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isFamilyOpen && (
            <View style={styles.expandedContent}>
              {formData.family_members && formData.family_members.length === 0 ? (
                <Text style={styles.emptyText}>No family members added yet</Text>
              ) : (
                formData.family_members.map((member, index) => (
                  <View key={member.id || index} style={styles.memberCard}>
                    <View style={styles.memberInfo}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberInitial}>
                          {member.fullname ? member.fullname.charAt(0).toUpperCase() : '?'}
                        </Text>
                      </View>
                      <View style={styles.memberDetails}>
                        <Text style={styles.memberName}>{member.fullname || 'Unknown'}</Text>
                        <Text style={styles.memberRelation}>
                          {member.relation || 'Unknown'}{member.age ? ` • ${member.age}y` : ''}
                        </Text>
                        
                        {member.gender && (
                          <View style={styles.memberContactRow}>
                            <Text style={styles.memberContactIcon}>👤</Text>
                            <Text style={styles.memberContactText}>{member.gender}</Text>
                          </View>
                        )}
                        
                        {member.email && (
                          <View style={styles.memberContactRow}>
                            <Text style={styles.memberContactIcon}>📧</Text>
                            <Text style={styles.memberContactText}>{member.email}</Text>
                          </View>
                        )}
                        
                        {member.phonenumber && (
                          <View style={styles.memberContactRow}>
                            <Text style={styles.memberContactIcon}>📱</Text>
                            <Text style={styles.memberContactText}>{member.phonenumber}</Text>
                          </View>
                        )}
                        
                        {member.bio && (
                          <Text style={styles.memberBio} numberOfLines={2}>{member.bio}</Text>
                        )}
                      </View>
                    </View>
                    
                    {isEditing && (
                      <View style={styles.memberActions}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => openEditFamilyModal(index)}
                          disabled={saving}
                        >
                          <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => removeFamilyMember(index)}
                          disabled={saving}
                        >
                          <Text style={styles.deleteIcon}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )}

              {isEditing && (
                <TouchableOpacity 
                  style={styles.addFamilyButton}
                  onPress={openAddFamilyModal}
                  disabled={saving}
                >
                  <Text style={styles.addFamilyButtonText}>+ Add Family Member</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.switchButton]} 
            onPress={handleSwitch}
          >
            <Text style={styles.switchButtonText}>
              {isHost ? '👤 Switch to Guest' : '🏠 Switch to Host'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>🚪 Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Family Member Modal */}
        <Modal visible={isFamilyModalOpen} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingMemberIndex !== null ? 'Edit Family Member' : 'Add Family Member'}
                </Text>
                <TouchableOpacity onPress={() => {
                  setIsFamilyModalOpen(false);
                  setEditingMemberIndex(null);
                }}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter full name"
                    placeholderTextColor="#999"
                    value={newMember.name}
                    onChangeText={(text) => setNewMember({ ...newMember, name: text })}
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Relation *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g., Spouse, Child, Parent"
                    placeholderTextColor="#999"
                    value={newMember.relation}
                    onChangeText={(text) => setNewMember({ ...newMember, relation: text })}
                  />
                </View>

                <View style={styles.modalRow}>
                  <View style={[styles.modalField, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.modalLabel}>Age</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Age"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={newMember.age}
                      onChangeText={(text) => setNewMember({ ...newMember, age: text })}
                    />
                  </View>
                  
                  <View style={[styles.modalField, { flex: 2 }]}>
                    <Text style={styles.modalLabel}>Email</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Email (optional)"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      value={newMember.email}
                      onChangeText={(text) => setNewMember({ ...newMember, email: text })}
                    />
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Gender</Text>
                  <View style={styles.genderContainer}>
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderOption,
                          newMember.gender === gender && styles.genderOptionSelected
                        ]}
                        onPress={() => setNewMember({ ...newMember, gender })}
                      >
                        <Text style={[
                          styles.genderText,
                          newMember.gender === gender && styles.genderTextSelected
                        ]}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Phone</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Phone number (optional)"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={newMember.phone}
                    onChangeText={(text) => setNewMember({ ...newMember, phone: text })}
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Bio</Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalTextArea]}
                    placeholder="Short note or bio (optional)"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                    value={newMember.bio}
                    onChangeText={(text) => setNewMember({ ...newMember, bio: text })}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalCancelButton]} 
                  onPress={() => {
                    setIsFamilyModalOpen(false);
                    setEditingMemberIndex(null);
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalSubmitButton]} 
                  onPress={addFamilyMember} 
                  disabled={saving}
                >
                  <Text style={styles.modalSubmitText}>
                    {saving ? 'Saving...' : (editingMemberIndex !== null ? 'Update' : 'Add')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#FF385C',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  notLoggedInIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF385C',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 5,
  },
  cameraIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  imagePendingBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  imagePendingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  genderBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  genderBadgeText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF385C',
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 20,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A4A4A',
    marginTop: 10,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 10,
    backgroundColor: '#FAFAFA',
  },
  infoContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 15,
    width: 25,
  },
  infoText: {
    fontSize: 15,
    color: '#4A4A4A',
    flex: 1,
  },
  form: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  genderOptionSelected: {
    backgroundColor: '#FF385C',
    borderColor: '#FF385C',
  },
  genderText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#FFFFFF',
  },
  verifyLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF385C',
  },
  verificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 10,
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  verificationText: {
    fontSize: 15,
    color: '#4A4A4A',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  habitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  habitTag: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  habitText: {
    fontSize: 14,
    color: '#4A4A4A',
    marginRight: 5,
  },
  removeIcon: {
    fontSize: 14,
    color: '#FF385C',
    marginLeft: 5,
    fontWeight: '600',
  },
  addHabitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  habitInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    padding: 15,
    fontSize: 15,
    marginRight: 10,
    backgroundColor: '#FAFAFA',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 15,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 30,
    fontStyle: 'italic',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  memberInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  memberAvatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#FF385C20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FF385C',
  },
  memberInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF385C',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  memberRelation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    fontWeight: '500',
  },
  memberContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  memberContactIcon: {
    fontSize: 12,
    marginRight: 6,
    width: 18,
  },
  memberContactText: {
    fontSize: 13,
    color: '#888888',
  },
  memberBio: {
    fontSize: 13,
    color: '#777777',
    marginTop: 6,
    fontStyle: 'italic',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  editIcon: {
    fontSize: 18,
  },
  deleteIcon: {
    fontSize: 18,
  },
  addFamilyButton: {
    borderWidth: 2,
    borderColor: '#FF385C',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#FF385C10',
  },
  addFamilyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF385C',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
  },
  switchButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 26,
    color: '#999999',
    fontWeight: '300',
  },
  modalField: {
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    marginLeft: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  modalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
  },
  modalButton: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F0F0F0',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  modalSubmitButton: {
    backgroundColor: '#FF385C',
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});