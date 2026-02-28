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
  updateUser, 
  getFamilyMembersByUserId,
  addFamilyMember as apiAddFamilyMember, 
  updateFamilyMember as apiUpdateFamilyMember, 
  deleteFamilyMember as apiDeleteFamilyMember,
  BASE_URL 
} from '../../BackendServices/Apiservices';

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
  const [frontId, setFrontId] = useState(null);
  const [newFrontId, setNewFrontId] = useState(null);
  const [backId, setBackId] = useState(null);
  const [newBackId, setNewBackId] = useState(null);
  const [passport, setPassport] = useState(null);
  const [newPassport, setNewPassport] = useState(null);
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
    status: 'pending'
  });
  
  // Habits - as array in frontend, but will be sent as JSON string to backend
  const [habits, setHabits] = useState([]);
  
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

  // ==================== LOAD DATA ====================
  useEffect(() => {
    if (authUser?.id) {
      loadData(authUser.id);
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const loadData = async (userId) => {
    try {
      const userRes = await getUserById(userId);
      const familyRes = await getFamilyMembersByUserId(userId);
      
      if (userRes?.success && userRes?.data) {
        const data = userRes.data;
        
        setUser({
          fullname: data.fullname || '',
          email: data.email || '',
          phonenumber: data.phonenumber ? String(data.phonenumber) : '',
          gender: data.gender || '',
          address: data.full_address || '',
          bio: data.bio || '',
          status: data.verification_status || 'pending'
        });
        
        // ✅ Load habits - backend sends as JSON string
        if (data.habbits) {
          try {
            // If it's already an array
            if (Array.isArray(data.habbits)) {
              setHabits(data.habbits);
            } 
            // If it's a string, parse it
            else if (typeof data.habbits === 'string') {
              const parsed = JSON.parse(data.habbits);
              setHabits(Array.isArray(parsed) ? parsed : []);
            } else {
              setHabits([]);
            }
          } catch (e) {
            console.log('Error parsing habits:', e);
            setHabits([]);
          }
        } else {
          setHabits([]);
        }
        
        // Images
        if (data.profile_picture) setProfileImage(getImageUrl(data.profile_picture));
        if (data.cnic_front_url) setFrontId(getImageUrl(data.cnic_front_url));
        if (data.cnic_back_url) setBackId(getImageUrl(data.cnic_back_url));
        if (data.passport_url) setPassport(getImageUrl(data.passport_url));
        if (data.live_image_url) setLiveImage(getImageUrl(data.live_image_url));
      }
      
      if (Array.isArray(familyRes)) setFamily(familyRes);
      else if (familyRes?.data) setFamily(familyRes.data);
      
    } catch (error) {
      console.log('Load error:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ==================== UPDATE USER ====================
  const saveUser = async () => {
    if (!authUser?.id) return;
    setSaving(true);
    setError('');
    
    try {
      // ✅ Convert habits array to JSON string for backend
      const habitsString = habits.length > 0 ? JSON.stringify(habits) : null;
      
      const data = {
        fullname: user.fullname,
        email: user.email,
        phonenumber: user.phonenumber ? String(user.phonenumber) : null,
        gender: user.gender,
        full_address: user.address,
        bio: user.bio,
        habbits: habitsString  // ✅ Send as JSON string to match backend
      };
      
      console.log('Sending data to backend:', data);
      
      const res = await updateUser(
        authUser.id, data, 
        newProfileImage, newFrontId, newBackId, newPassport, newLiveImage
      );
      
      if (res?.success) {
        // Update images from response
        if (res.data?.profile_picture) setProfileImage(getImageUrl(res.data.profile_picture));
        if (res.data?.cnic_front_url) setFrontId(getImageUrl(res.data.cnic_front_url));
        if (res.data?.cnic_back_url) setBackId(getImageUrl(res.data.cnic_back_url));
        if (res.data?.passport_url) setPassport(getImageUrl(res.data.passport_url));
        if (res.data?.live_image_url) setLiveImage(getImageUrl(res.data.live_image_url));
        
        // ✅ Update habits from response if returned
        if (res.data?.habbits) {
          try {
            // Parse JSON string back to array
            const parsedHabits = JSON.parse(res.data.habbits);
            setHabits(Array.isArray(parsedHabits) ? parsedHabits : []);
          } catch (e) {
            console.log('Error parsing habits response:', e);
          }
        }
        
        setNewProfileImage(null);
        setNewFrontId(null);
        setNewBackId(null);
        setNewPassport(null);
        setNewLiveImage(null);
        
        setIsEditing(false);
        setError('');
      }
    } catch (error) {
      console.log('Update error:', error);
      setError('Update failed');
    } finally {
      setSaving(false);
    }
  };

  // ==================== IMAGE PICKER ====================
  const pickImage = (setImage, allowGallery = true) => {
    if (allowGallery) {
      launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
        if (res.assets?.[0]) setImage(res.assets[0].uri);
      });
    } else {
      launchCamera({ mediaType: 'photo', quality: 0.8 }, (res) => {
        if (res.assets?.[0]) setImage(res.assets[0].uri);
      });
    }
  };

  // ==================== HABITS ====================
  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, newHabit.trim()]);
      setNewHabit('');
    }
  };
  
  const removeHabit = (index) => {
    setHabits(habits.filter((_, i) => i !== index));
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
  
  const saveFamily = async () => {
    if (!newMember.name || !newMember.relation) {
      setError('Name and Relation required');
      return;
    }
    
    setSaving(true);
    setError('');
    
    const data = {
      fullname: newMember.name,
      relation: newMember.relation,
      age: newMember.age ? parseInt(newMember.age) : null,
      gender: newMember.gender || null,
      email: newMember.email || null,
      phonenumber: newMember.phone ? String(newMember.phone) : null,
      bio: newMember.bio || null
    };
    
    try {
      if (editMemberIndex !== null) {
        const id = family[editMemberIndex].id;
        const res = await apiUpdateFamilyMember(id, data);
        if (res?.success) {
          const fresh = await getFamilyMembersByUserId(authUser.id);
          setFamily(Array.isArray(fresh) ? fresh : []);
        }
      } else {
        const res = await apiAddFamilyMember(authUser.id, data);
        if (res?.success) {
          const fresh = await getFamilyMembersByUserId(authUser.id);
          setFamily(Array.isArray(fresh) ? fresh : []);
        }
      }
      setShowFamilyModal(false);
      setEditMemberIndex(null);
    } catch (error) {
      console.log('Family error:', error);
      setError('Operation failed');
    } finally {
      setSaving(false);
    }
  };
  
  const deleteFamily = (index) => {
    const member = family[index];
    if (!member?.id) return;
    
    setSaving(true);
    setError('');
    
    apiDeleteFamilyMember(member.id).then(res => {
      if (res?.success) {
        getFamilyMembersByUserId(authUser.id).then(fresh => {
          setFamily(Array.isArray(fresh) ? fresh : []);
        });
      }
    }).catch(err => {
      console.log('Delete error:', err);
      setError('Delete failed');
    }).finally(() => {
      setSaving(false);
    });
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
    } catch (e) {}
  };

  const getStatusColor = (s) => {
    if (s === 'approved') return '#4CAF50';
    if (s === 'rejected') return '#F44336';
    if (s === 'submitted') return '#FF9800';
    return '#9E9E9E';
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF385C" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== RENDER ====================
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
                style={styles.cancelBtn} 
                onPress={() => {
                  setNewProfileImage(null);
                  setNewFrontId(null);
                  setNewBackId(null);
                  setNewPassport(null);
                  setNewLiveImage(null);
                  setIsEditing(false);
                  setError('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={saveUser} 
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

      <ScrollView contentContainerStyle={styles.scroll}>
        
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

        {/* Verification Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verification</Text>
            {user.status !== 'approved' && (
              <TouchableOpacity onPress={() => setShowVerifyModal(true)}>
                <Text style={styles.verifyLink}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.verificationRow}>
            <Text style={styles.verificationLabel}>Identity Document</Text>
            <View style={[styles.statusPill, { backgroundColor: getStatusColor(user.status) + '20' }]}>
              <Text style={[styles.statusPillText, { color: getStatusColor(user.status) }]}>
                {user.status === 'approved' ? 'Verified' : 'Pending'}
              </Text>
            </View>
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
                      key={index} 
                      style={styles.habitItem} 
                      onPress={() => isEditing && removeHabit(index)}
                      disabled={!isEditing}
                    >
                      <Text style={styles.habitText}>{habit}</Text>
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

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.action, styles.switchAction]} onPress={switchRole}>
            <Text style={styles.actionText}>{isHost ? '👤 Guest Mode' : '🏠 Host Mode'}</Text>
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
                  style={styles.modalCancel} 
                  onPress={() => setShowFamilyModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalSave} 
                  onPress={saveFamily}
                  disabled={saving}
                >
                  <Text style={styles.modalSaveText}>
                    {saving ? 'Saving...' : (editMemberIndex !== null ? 'Update' : 'Add')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Verification Modal */}
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

                <Text style={styles.label}>Front ID (Required)</Text>
                <TouchableOpacity 
                  style={[styles.uploadBox, (newFrontId || frontId) && styles.uploadBoxFilled]} 
                  onPress={() => pickImage(setNewFrontId, true)}
                >
                  {newFrontId ? (
                    <Image source={{ uri: newFrontId }} style={styles.uploadImage} />
                  ) : frontId ? (
                    <Image source={{ uri: frontId }} style={styles.uploadImage} />
                  ) : (
                    <Text style={styles.uploadText}>📸 Tap to upload</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.label}>Back ID (Required)</Text>
                <TouchableOpacity 
                  style={[styles.uploadBox, (newBackId || backId) && styles.uploadBoxFilled]} 
                  onPress={() => pickImage(setNewBackId, true)}
                >
                  {newBackId ? (
                    <Image source={{ uri: newBackId }} style={styles.uploadImage} />
                  ) : backId ? (
                    <Image source={{ uri: backId }} style={styles.uploadImage} />
                  ) : (
                    <Text style={styles.uploadText}>📸 Tap to upload</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.label}>Passport (Optional)</Text>
                <TouchableOpacity 
                  style={[styles.uploadBox, (newPassport || passport) && styles.uploadBoxFilled]} 
                  onPress={() => pickImage(setNewPassport, true)}
                >
                  {newPassport ? (
                    <Image source={{ uri: newPassport }} style={styles.uploadImage} />
                  ) : passport ? (
                    <Image source={{ uri: passport }} style={styles.uploadImage} />
                  ) : (
                    <Text style={styles.uploadText}>📸 Tap to upload</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.label}>Live Photo (Optional)</Text>
                <TouchableOpacity 
                  style={[styles.uploadBox, (newLiveImage || liveImage) && styles.uploadBoxFilled]} 
                  onPress={() => pickImage(setNewLiveImage, false)}
                >
                  {newLiveImage ? (
                    <Image source={{ uri: newLiveImage }} style={styles.uploadImage} />
                  ) : liveImage ? (
                    <Image source={{ uri: liveImage }} style={styles.uploadImage} />
                  ) : (
                    <Text style={styles.uploadText}>📸 Take photo (camera only)</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancel} 
                  onPress={() => setShowVerifyModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalSave} 
                  onPress={() => {
                    if (!newFrontId && !frontId) {
                      setError('Front ID is required');
                      return;
                    }
                    if (!newBackId && !backId) {
                      setError('Back ID is required');
                      return;
                    }
                    setShowVerifyModal(false);
                  }}
                >
                  <Text style={styles.modalSaveText}>Done</Text>
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
  
  scroll: {
    paddingBottom: 20,
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
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verificationLabel: {
    fontSize: 14,
    color: '#444',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '500',
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
  
  // Upload
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
  uploadText: {
    color: '#999',
    fontSize: 14,
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
  
  // Actions
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
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
    maxHeight: height * 0.8,
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
  modalCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  modalSave: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FF385C',
  },
  modalSaveText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
  
  verifySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
});