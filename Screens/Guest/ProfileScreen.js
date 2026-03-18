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
  BASE_URL 
} from '../../BackendServices/Apiservices';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  // ==================== STATE ====================
  const [isEditing, setIsEditing] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [editMemberIndex, setEditMemberIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Images
  const [profileImage, setProfileImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  
  // ID Card Images
  const [frontId, setFrontId] = useState(null);
  const [newFrontId, setNewFrontId] = useState(null);
  const [backId, setBackId] = useState(null);
  const [newBackId, setNewBackId] = useState(null);
  const [passport, setPassport] = useState(null);
  const [newPassport, setNewPassport] = useState(null);
  
  // Live Image - Camera Only
  const [liveImage, setLiveImage] = useState(null);
  const [newLiveImage, setNewLiveImage] = useState(null);

  // User data
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    gender: '',
    address: '',
    bio: '',
    status: 'pending',
    role: 'guest'
  });
  
  // Habits - use unique IDs
  const [habits, setHabits] = useState([]);
  
  // Family members
  const [family, setFamily] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  // New family member
  const [newMember, setNewMember] = useState({
    name: '', relation: '', age: '', gender: '', email: '', phone: '', bio: ''
  });

  const navigation = useNavigation();
  const context = useContext(AuthContext) || {};
  const { logout, isHost, switchToHost, switchToGuest, user: authUser } = context;

  // ==================== HELPER ====================
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/${path}`;
  };

  // ==================== LOAD USER DATA ====================
  useEffect(() => {
    if (authUser?.id) {
      loadUserData(authUser.id);
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const loadUserData = async (userId) => {
    try {
      const response = await getUserById(userId);
      
      if (response?.success && response?.data) {
        const data = response.data;
        
        setUser({
          fullname: data.fullname || '',
          email: data.email || '',
          phonenumber: data.phonenumber ? String(data.phonenumber) : '',
          gender: data.gender || '',
          address: data.full_address || '',
          bio: data.bio || '',
          status: data.verification_status || 'pending',
          role: data.role || 'guest'
        });
        
        // Habits - add unique IDs
        if (data.habbits) {
          let habitsArray = [];
          if (Array.isArray(data.habbits)) {
            habitsArray = data.habbits;
          } else if (typeof data.habbits === 'string') {
            try {
              habitsArray = JSON.parse(data.habbits);
            } catch (e) {
              habitsArray = [];
            }
          }
          // Add unique ID to each habit for proper deletion
          const habitsWithIds = habitsArray.map((habit, index) => ({
            id: `habit_${Date.now()}_${index}`,
            text: habit
          }));
          setHabits(habitsWithIds);
        }
        
        // Family members
        if (data.family_members && Array.isArray(data.family_members)) {
          setFamily(data.family_members);
        }
        
        // Images
        if (data.profile_picture) setProfileImage(getImageUrl(data.profile_picture));
        if (data.cnic_front_url) setFrontId(getImageUrl(data.cnic_front_url));
        if (data.cnic_back_url) setBackId(getImageUrl(data.cnic_back_url));
        if (data.passport_url) setPassport(getImageUrl(data.passport_url));
        if (data.live_image_url) setLiveImage(getImageUrl(data.live_image_url));
      }
      
    } catch (error) {
      console.log('Load error:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!authUser?.id) return;
    setSaving(true);
    setError('');
    
    try {
      const formData = new FormData();
      
      if (user.fullname) formData.append('fullname', user.fullname);
      if (user.email) formData.append('email', user.email);
      if (user.phonenumber) formData.append('phonenumber', user.phonenumber);
      if (user.gender) formData.append('gender', user.gender);
      if (user.address) formData.append('full_address', user.address);
      if (user.bio) formData.append('bio', user.bio);
      
      if (habits.length >= 0) {
        const habitsText = habits.map(h => h.text);
        formData.append('habbits', JSON.stringify(habitsText));
      }
      
      if (family.length >= 0) {
        formData.append('family_members', JSON.stringify(family));
      }
      
      if (newProfileImage) {
        formData.append('profile_picture', {
          uri: newProfileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
      
      if (newFrontId) {
        formData.append('cnic_front', {
          uri: newFrontId,
          type: 'image/jpeg',
          name: 'front_id.jpg',
        });
      }
      
      if (newBackId) {
        formData.append('cnic_back', {
          uri: newBackId,
          type: 'image/jpeg',
          name: 'back_id.jpg',
        });
      }
      
      if (newPassport) {
        formData.append('passport', {
          uri: newPassport,
          type: 'image/jpeg',
          name: 'passport.jpg',
        });
      }
      
      if (newLiveImage) {
        formData.append('live_image', {
          uri: newLiveImage,
          type: 'image/jpeg',
          name: 'live.jpg',
        });
      }
      
      const response = await axios.put(
        `${BASE_URL}/users/profile_update_simple/${authUser.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const res = response.data;
      
      if (res?.success) {
        const data = res.user;
        
        setUser({
          fullname: data.fullname || '',
          email: data.email || '',
          phonenumber: data.phonenumber ? String(data.phonenumber) : '',
          gender: data.gender || '',
          address: data.full_address || '',
          bio: data.bio || '',
          status: data.verification_status || 'pending',
          role: data.role || 'guest'
        });
        
        // Habits - add IDs again
        if (data.habbits) {
          let habitsArray = [];
          if (Array.isArray(data.habbits)) {
            habitsArray = data.habbits;
          } else if (typeof data.habbits === 'string') {
            try {
              habitsArray = JSON.parse(data.habbits);
            } catch (e) {}
          }
          const habitsWithIds = habitsArray.map((habit, index) => ({
            id: `habit_${Date.now()}_${index}`,
            text: habit
          }));
          setHabits(habitsWithIds);
        }
        
        // Family members
        if (data.family_members && Array.isArray(data.family_members)) {
          setFamily(data.family_members);
        }
        
        // Images
        if (data.profile_picture) setProfileImage(getImageUrl(data.profile_picture));
        if (data.cnic_front_url) setFrontId(getImageUrl(data.cnic_front_url));
        if (data.cnic_back_url) setBackId(getImageUrl(data.cnic_back_url));
        if (data.passport_url) setPassport(getImageUrl(data.passport_url));
        if (data.live_image_url) setLiveImage(getImageUrl(data.live_image_url));
        
        // Clear new images
        setNewProfileImage(null);
        setNewFrontId(null);
        setNewBackId(null);
        setNewPassport(null);
        setNewLiveImage(null);
        
        setIsEditing(false);
        setError('');
        
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.log('Update error:', error);
      setError('Update failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSaving(false);
    }
  };

  // ==================== IMAGE PICKER ====================
  const pickImage = (setImage, allowGallery = true) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    if (allowGallery) {
      launchImageLibrary(options, (res) => {
        if (res.assets?.[0]) {
          setImage(res.assets[0].uri);
        }
      });
    } else {
      launchCamera(options, (res) => {
        if (res.assets?.[0]) {
          setImage(res.assets[0].uri);
        }
      });
    }
  };

  // ==================== HABITS ====================
  const addHabit = () => {
    if (newHabit.trim()) {
      const newHabitItem = {
        id: `habit_${Date.now()}_${habits.length}`,
        text: newHabit.trim()
      };
      setHabits([...habits, newHabitItem]);
      setNewHabit('');
    }
  };
  
  const removeHabit = (index) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    console.log('Habit deleted, new count:', updatedHabits.length);
  };

  // ==================== FAMILY ====================
  const openAddFamily = () => {
    setEditMemberIndex(null);
    setNewMember({ name: '', relation: '', age: '', gender: '', email: '', phone: '', bio: '' });
    setShowFamilyModal(true);
  };
  
  const openEditFamily = (index) => {
    const m = family[index];
    setEditMemberIndex(index);
    setNewMember({
      name: m.fullname || '',
      relation: m.relation || '',
      age: m.age ? String(m.age) : '',
      gender: m.gender || '',
      email: m.email || '',
      phone: m.phonenumber ? String(m.phonenumber) : '',
      bio: m.bio || ''
    });
    setShowFamilyModal(true);
  };
  
  const saveFamily = () => {
    if (!newMember.name || !newMember.relation) {
      setError('Name and Relation required');
      return;
    }
    
    const newMemberData = {
      id: editMemberIndex !== null ? family[editMemberIndex].id : Date.now(),
      fullname: newMember.name,
      relation: newMember.relation,
      age: newMember.age ? parseInt(newMember.age) : null,
      gender: newMember.gender || null,
      email: newMember.email || null,
      phonenumber: newMember.phone || null,
      bio: newMember.bio || null
    };
    
    let updatedFamily;
    
    if (editMemberIndex !== null) {
      updatedFamily = [...family];
      updatedFamily[editMemberIndex] = newMemberData;
    } else {
      updatedFamily = [...family, newMemberData];
    }
    
    setFamily(updatedFamily);
    console.log('Family updated, new count:', updatedFamily.length);
    
    setShowFamilyModal(false);
    setEditMemberIndex(null);
    setNewMember({ name: '', relation: '', age: '', gender: '', email: '', phone: '', bio: '' });
    setError('');
  };
  
  const deleteFamily = (index) => {
    const updatedFamily = family.filter((_, i) => i !== index);
    setFamily(updatedFamily);
    console.log('Family member deleted, new count:', updatedFamily.length);
  };

  // ==================== LOGOUT & SWITCH ====================
  const doLogout = () => {
    logout?.();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };
  
  const switchRole = () => {
    try {
      if (isHost) {
        switchToGuest?.();
        navigation.reset({ index: 0, routes: [{ name: 'GuestTab' }] });
      } else {
        switchToHost?.();
        navigation.reset({ index: 0, routes: [{ name: 'HostTab' }] });
      }
    } catch (e) {
      console.log('Switch role error:', e);
    }
  };

  const getStatusColor = (s) => {
    if (s === 'approved') return '#4CAF50';
    if (s === 'rejected') return '#F44336';
    if (s === 'submitted') return '#FF9800';
    return '#9E9E9E';
  };

  // ==================== VERIFICATION MODAL ====================
  const VerificationModal = () => (
    <Modal visible={showVerifyModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Identity Verification</Text>
            <TouchableOpacity onPress={() => setShowVerifyModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.verifySubtitle}>
              Upload clear photos of your documents
            </Text>

            {/* Front ID */}
            <View style={styles.verifySection}>
              <Text style={styles.verifyLabel}>Front ID (Required)</Text>
              <TouchableOpacity 
                style={[styles.uploadBox, (newFrontId || frontId) && styles.uploadBoxFilled]} 
                onPress={() => pickImage(setNewFrontId, true)}
              >
                {newFrontId ? (
                  <Image source={{ uri: newFrontId }} style={styles.uploadImage} />
                ) : frontId ? (
                  <Image source={{ uri: frontId }} style={styles.uploadImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>📸</Text>
                    <Text style={styles.uploadText}>Tap to upload front ID</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Back ID */}
            <View style={styles.verifySection}>
              <Text style={styles.verifyLabel}>Back ID (Required)</Text>
              <TouchableOpacity 
                style={[styles.uploadBox, (newBackId || backId) && styles.uploadBoxFilled]} 
                onPress={() => pickImage(setNewBackId, true)}
              >
                {newBackId ? (
                  <Image source={{ uri: newBackId }} style={styles.uploadImage} />
                ) : backId ? (
                  <Image source={{ uri: backId }} style={styles.uploadImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>📸</Text>
                    <Text style={styles.uploadText}>Tap to upload back ID</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Passport (Optional) */}
            <View style={styles.verifySection}>
              <Text style={styles.verifyLabel}>Passport (Optional)</Text>
              <TouchableOpacity 
                style={[styles.uploadBox, (newPassport || passport) && styles.uploadBoxFilled]} 
                onPress={() => pickImage(setNewPassport, true)}
              >
                {newPassport ? (
                  <Image source={{ uri: newPassport }} style={styles.uploadImage} />
                ) : passport ? (
                  <Image source={{ uri: passport }} style={styles.uploadImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>📸</Text>
                    <Text style={styles.uploadText}>Tap to upload passport</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Live Image - Camera Only */}
            <View style={styles.verifySection}>
              <Text style={styles.verifyLabel}>Live Photo</Text>
              <TouchableOpacity 
                style={[styles.uploadBox, (newLiveImage || liveImage) && styles.uploadBoxFilled]} 
                onPress={() => pickImage(setNewLiveImage, false)}
              >
                {newLiveImage ? (
                  <Image source={{ uri: newLiveImage }} style={styles.uploadImage} />
                ) : liveImage ? (
                  <Image source={{ uri: liveImage }} style={styles.uploadImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>📸</Text>
                    <Text style={styles.uploadText}>Take a live photo (camera only)</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalBtn, styles.modalCancel]} 
              onPress={() => setShowVerifyModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalBtn, styles.modalSave]} 
              onPress={() => setShowVerifyModal(false)}
            >
              <Text style={styles.modalSaveText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ==================== LOADING ====================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF385C" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header - Fixed at top */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerButtons}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => {
                  setNewProfileImage(null);
                  setNewFrontId(null);
                  setNewBackId(null);
                  setNewPassport(null);
                  setNewLiveImage(null);
                  setIsEditing(false);
                  setError('');
                  loadUserData(authUser.id);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={saveProfile} 
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Save</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Scrollable Content - Takes remaining space */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                newProfileImage ? { uri: newProfileImage } :
                profileImage ? { uri: profileImage } :
                { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }
              }
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity 
                style={styles.cameraBtn}
                onPress={() => pickImage(setNewProfileImage, true)}
              >
                <Text style={styles.cameraText}>📷</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.name}>{user.fullname || 'User'}</Text>
          
          {/* Role Badge - Shows correct role based on isHost state */}
          <View style={[styles.roleBadge, isHost ? styles.hostBadge : styles.guestBadge]}>
            <Text style={styles.roleText}>
              {isHost ? '🏠 Host' : '👤 Guest'}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
              {user.status === 'approved' ? 'Verified' : 
               user.status === 'submitted' ? 'Under Review' : 'Not Verified'}
            </Text>
          </View>
        </View>

        {/* About Section */}
        {(user.bio || isEditing) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            {isEditing ? (
              <TextInput
                style={styles.bioInput}
                multiline
                placeholder="Tell about yourself..."
                placeholderTextColor="#999"
                value={user.bio}
                onChangeText={(t) => setUser({...user, bio: t})}
              />
            ) : (
              <Text style={styles.bioText}>{user.bio || 'No bio added'}</Text>
            )}
          </View>
        )}

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          
          {isEditing ? (
            <View>
              <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                placeholderTextColor="#999"
                value={user.fullname} 
                onChangeText={(t) => setUser({...user, fullname: t})} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Email" 
                placeholderTextColor="#999"
                value={user.email} 
                onChangeText={(t) => setUser({...user, email: t})} 
                keyboardType="email-address" 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Phone" 
                placeholderTextColor="#999"
                value={user.phonenumber} 
                onChangeText={(t) => setUser({...user, phonenumber: t})} 
                keyboardType="phone-pad" 
              />
              
              <View style={styles.genderRow}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderBtn, user.gender === g && styles.genderActive]}
                    onPress={() => setUser({...user, gender: g})}
                  >
                    <Text style={[styles.genderText, user.gender === g && styles.genderTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput 
                style={styles.input} 
                placeholder="Address" 
                placeholderTextColor="#999"
                value={user.address} 
                onChangeText={(t) => setUser({...user, address: t})} 
              />
            </View>
          ) : (
            <View>
              <Text style={styles.info}>📧 {user.email || 'No email'}</Text>
              {user.phonenumber && <Text style={styles.info}>📱 {user.phonenumber}</Text>}
              {user.gender && <Text style={styles.info}>👤 {user.gender}</Text>}
              {user.address && <Text style={styles.info}>📍 {user.address}</Text>}
            </View>
          )}
        </View>

        {/* Verification Button */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verification</Text>
            {user.status !== 'approved' && (
              <TouchableOpacity onPress={() => setShowVerifyModal(true)}>
                <Text style={styles.verifyLink}>Upload Documents</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Document Status */}
          {(frontId || backId || passport || liveImage) && (
            <View style={styles.docStatus}>
              {frontId && <Text style={styles.docStatusText}>✅ Front ID uploaded</Text>}
              {backId && <Text style={styles.docStatusText}>✅ Back ID uploaded</Text>}
              {passport && <Text style={styles.docStatusText}>✅ Passport uploaded</Text>}
              {liveImage && <Text style={styles.docStatusText}>✅ Live photo uploaded</Text>}
            </View>
          )}
        </View>

        {/* Habits Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowHabits(!showHabits)}>
            <Text style={styles.sectionTitle}>Habits</Text>
            <Text style={styles.arrow}>{showHabits ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showHabits && (
            <View>
              <View style={styles.habitsList}>
                {habits.length > 0 ? (
                  habits.map((habit, index) => (
                    <TouchableOpacity 
                      key={habit.id || index} 
                      style={styles.habitItem} 
                      onPress={() => isEditing && removeHabit(index)}
                      disabled={!isEditing}
                    >
                      <Text style={styles.habitText}>{habit.text || habit}</Text>
                      {isEditing && <Text style={styles.removeIcon}> ✕</Text>}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No habits added</Text>
                )}
              </View>

              {isEditing && (
                <View style={styles.addRow}>
                  <TextInput 
                    style={styles.habitInput} 
                    placeholder="Add a new habit..." 
                    placeholderTextColor="#999"
                    value={newHabit} 
                    onChangeText={setNewHabit} 
                  />
                  <TouchableOpacity style={styles.addBtn} onPress={addHabit}>
                    <Text style={styles.addBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Family Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowFamily(!showFamily)}>
            <Text style={styles.sectionTitle}>Family</Text>
            <Text style={styles.arrow}>{showFamily ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showFamily && (
            <View>
              {family.map((m, i) => (
                <View key={m.id || i} style={styles.familyItem}>
                  <View style={styles.familyInfo}>
                    <View style={styles.familyAvatar}>
                      <Text style={styles.familyInitial}>{m.fullname?.[0] || '?'}</Text>
                    </View>
                    <View style={styles.familyDetails}>
                      <Text style={styles.familyName}>{m.fullname}</Text>
                      <Text style={styles.familyRelation}>
                        {m.relation}{m.age ? ` • ${m.age}y` : ''}
                      </Text>
                      {m.gender && <Text style={styles.familyContact}>👤 {m.gender}</Text>}
                      {m.email && <Text style={styles.familyContact}>📧 {m.email}</Text>}
                      {m.phonenumber && <Text style={styles.familyContact}>📱 {m.phonenumber}</Text>}
                      {m.bio && <Text style={styles.familyBio} numberOfLines={1}>{m.bio}</Text>}
                    </View>
                  </View>
                  {isEditing && (
                    <View style={styles.familyActions}>
                      <TouchableOpacity onPress={() => openEditFamily(i)}>
                        <Text style={styles.editIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteFamily(i)}>
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
              {family.length === 0 && <Text style={styles.emptyText}>No family members</Text>}

              {isEditing && (
                <TouchableOpacity style={styles.addFamilyBtn} onPress={openAddFamily}>
                  <Text style={styles.addFamilyText}>+ Add Member</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Add extra bottom padding to scroll content to avoid buttons overlap */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Fixed Bottom Actions - Always visible at bottom */}
      <View style={styles.fixedActions}>
        <TouchableOpacity style={[styles.action, styles.switchAction]} onPress={switchRole}>
          <Text style={styles.actionText}>{isHost ? '👤 Switch to Guest' : '🏠 Switch to Host'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.action, styles.logoutAction]} onPress={doLogout}>
          <Text style={styles.actionText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Family Modal */}
      <Modal visible={showFamilyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMemberIndex !== null ? 'Edit' : 'Add'} Family Member
              </Text>
              <TouchableOpacity onPress={() => setShowFamilyModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder="Enter full name"
                placeholderTextColor="#999"
                value={newMember.name} 
                onChangeText={(t) => setNewMember({...newMember, name: t})} 
              />
              
              <Text style={styles.label}>Relation *</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder="e.g., Spouse, Child, Parent"
                placeholderTextColor="#999"
                value={newMember.relation} 
                onChangeText={(t) => setNewMember({...newMember, relation: t})} 
              />
              
              <View style={styles.modalRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput 
                    style={styles.modalInput} 
                    placeholder="Age"
                    placeholderTextColor="#999"
                    value={newMember.age} 
                    onChangeText={(t) => setNewMember({...newMember, age: t})} 
                    keyboardType="numeric" 
                  />
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput 
                    style={styles.modalInput} 
                    placeholder="Email (optional)"
                    placeholderTextColor="#999"
                    value={newMember.email} 
                    onChangeText={(t) => setNewMember({...newMember, email: t})} 
                    keyboardType="email-address" 
                  />
                </View>
              </View>
              
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderBtn, newMember.gender === g && styles.genderActive]}
                    onPress={() => setNewMember({...newMember, gender: g})}
                  >
                    <Text style={[styles.genderText, newMember.gender === g && styles.genderTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.label}>Phone</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder="Phone number (optional)"
                placeholderTextColor="#999"
                value={newMember.phone} 
                onChangeText={(t) => setNewMember({...newMember, phone: t})} 
                keyboardType="phone-pad" 
              />
              
              <Text style={styles.label}>Bio</Text>
              <TextInput 
                style={[styles.modalInput, styles.textArea]} 
                placeholder="Short note or bio (optional)"
                placeholderTextColor="#999"
                value={newMember.bio} 
                onChangeText={(t) => setNewMember({...newMember, bio: t})} 
                multiline 
                numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalCancel]} 
                onPress={() => setShowFamilyModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalSave]} 
                onPress={saveFamily}
              >
                <Text style={styles.modalSaveText}>
                  {editMemberIndex !== null ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Verification Modal */}
      <VerificationModal />
    </SafeAreaView>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  editText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FF385C',
  },
  saveText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Error
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#FFEBEE',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  
  scrollContent: {
    paddingBottom: 80, // Add padding to prevent content from hiding behind fixed buttons
  },
  
  // Profile Card
  profileCard: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#F0F0F0',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF385C',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cameraText: {
    color: '#FFF',
    fontSize: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  
  // Role Badge
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  hostBadge: {
    backgroundColor: '#007AFF20',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  guestBadge: {
    backgroundColor: '#FF385C20',
    borderWidth: 1,
    borderColor: '#FF385C',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Common Section
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  arrow: {
    fontSize: 14,
    color: '#666',
  },
  
  // About
  bioText: {
    color: '#444',
    lineHeight: 20,
    fontSize: 14,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
  },
  
  // Contact
  info: {
    marginVertical: 4,
    fontSize: 14,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    fontSize: 14,
    color: '#333',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  genderActive: {
    backgroundColor: '#FF385C',
  },
  genderText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#FFF',
  },
  
  // Verification
  verifyLink: {
    color: '#FF385C',
    fontWeight: '500',
    fontSize: 14,
  },
  docStatus: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  docStatusText: {
    fontSize: 13,
    color: '#4CAF50',
    marginVertical: 2,
  },
  
  // Upload Boxes
  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  uploadBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#4CAF50',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 30,
    color: '#999',
    marginBottom: 5,
  },
  uploadText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Habits
  habitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  habitItem: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 3,
    alignItems: 'center',
  },
  habitText: {
    fontSize: 14,
    color: '#444',
  },
  removeIcon: {
    color: '#FF385C',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    padding: 15,
    fontSize: 14,
    fontStyle: 'italic',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  habitInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
    fontSize: 14,
    color: '#333',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  
  // Family
  familyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  familyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  familyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF385C20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FF385C',
  },
  familyInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF385C',
  },
  familyDetails: {
    flex: 1,
  },
  familyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  familyRelation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  familyContact: {
    fontSize: 12,
    color: '#888',
  },
  familyBio: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  familyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editIcon: {
    fontSize: 16,
    color: '#007AFF',
  },
  deleteIcon: {
    fontSize: 16,
    color: '#F44336',
  },
  addFamilyBtn: {
    borderWidth: 1,
    borderColor: '#FF385C',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addFamilyText: {
    color: '#FF385C',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Fixed Actions
  fixedActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  action: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  switchAction: {
    backgroundColor: '#007AFF',
  },
  logoutAction: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    fontSize: 22,
    color: '#999',
  },
  label: {
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
    color: '#666',
    fontSize: 14,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalRow: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancel: {
    backgroundColor: '#F0F0F0',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  modalSave: {
    backgroundColor: '#FF385C',
  },
  modalSaveText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Verification Modal Specific
  verifySection: {
    marginBottom: 15,
  },
  verifySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  verifyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  docStatusSummary: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  docStatusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
});