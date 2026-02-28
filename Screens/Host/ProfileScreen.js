import React, { useState, useContext } from 'react';
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
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isHabitOpen, setIsHabitOpen] = useState(false);
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);

  const [frontId, setFrontId] = useState(null);
  const [backId, setBackId] = useState(null);
  const [passport, setPassport] = useState(null);
  const [livePhotos, setLivePhotos] = useState([]);

  const [formData, setFormData] = useState({
    fullname: 'Guest User',
    email: 'guest@email.com',
    phonenumber: '',
    gender: '',
    address: '',
    role: 'guest',
    verification_status: 'pending',
    bio: '',
    habbits: [],
    family_members: [],
  });

  const [newHabbit, setNewHabbit] = useState('');
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    age: '',
    gender: '',
    address: '',
    email: '',
    phone: '',
    bio: ''
  });

  const navigation = useNavigation();
  
  const context = useContext(AuthContext) || {};
  const { 
    logout = () => {}, 
    isHost = false, 
    switchToHost = () => {}, 
    switchToGuest = () => {},
    user = null 
  } = context;

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
            try {
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (e) {
              console.log('Navigation error:', e);
            }
          }
        }
      ]
    );
  };

  const handleSwitch = () => {
    try {
      if (isHost) {
        if (typeof switchToGuest === 'function') {
          switchToGuest();
          navigation.reset({ index: 0, routes: [{ name: 'GuestTab' }] });
        } else {
          Alert.alert("Info", "Switching to guest mode is not available");
        }
      } else {
        if (typeof switchToHost === 'function') {
          switchToHost();
          navigation.reset({ index: 0, routes: [{ name: 'HostTab' }] });
        } else {
          Alert.alert("Info", "Switching to host mode is not available");
        }
      }
    } catch (e) {
      console.log('Switch error:', e);
      Alert.alert("Error", "Could not switch role");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const openAddFamilyModal = () => {
    setEditingMemberIndex(null);
    setNewMember({
      name: '',
      relation: '',
      age: '',
      gender: '',
      address: '',
      email: '',
      phone: '',
      bio: ''
    });
    setIsFamilyModalOpen(true);
  };

  const openEditFamilyModal = (index) => {
    setEditingMemberIndex(index);
    setNewMember(formData.family_members[index]);
    setIsFamilyModalOpen(true);
  };

  const addFamilyMember = () => {
    if (!newMember.name || !newMember.relation) {
      Alert.alert("Error", "Name & Relation are required");
      return;
    }

    if (editingMemberIndex !== null) {
      // Update existing member
      const updatedMembers = [...formData.family_members];
      updatedMembers[editingMemberIndex] = newMember;
      setFormData(prev => ({
        ...prev,
        family_members: updatedMembers
      }));
      Alert.alert("Success", "Family member updated successfully");
    } else {
      // Add new member
      setFormData(prev => ({
        ...prev,
        family_members: [...prev.family_members, newMember]
      }));
      Alert.alert("Success", "Family member added successfully");
    }

    setNewMember({ name: '', relation: '', age: '', gender: '', address: '', email: '', phone: '', bio: '' });
    setEditingMemberIndex(null);
    setIsFamilyModalOpen(false);
  };

  const removeFamilyMember = (index) => {
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this family member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setFormData(prev => ({
              ...prev,
              family_members: prev.family_members.filter((_, i) => i !== index)
            }));
          }
        }
      ]
    );
  };

  const openImagePicker = (setImage) => {
    Alert.alert(
      "Select Image",
      "Choose option",
      [
        {
          text: "Camera",
          onPress: async () => {
            try {
              const result = await launchCamera({ mediaType: 'photo' });
              if (result.assets && result.assets[0]) {
                setImage(result.assets[0].uri);
              }
            } catch (error) {
              Alert.alert("Error", "Could not open camera");
            }
          }
        },
        {
          text: "Gallery",
          onPress: async () => {
            try {
              const result = await launchImageLibrary({ mediaType: 'photo' });
              if (result.assets && result.assets[0]) {
                setImage(result.assets[0].uri);
              }
            } catch (error) {
              Alert.alert("Error", "Could not open gallery");
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const takeLivePhoto = async () => {
    try {
      const result = await launchCamera({ mediaType: 'photo' });
      if (result.assets && result.assets[0]) {
        const newLivePhoto = {
          uri: result.assets[0].uri,
          timestamp: new Date().toLocaleTimeString()
        };
        setLivePhotos(prev => [...prev, newLivePhoto]);
      }
    } catch (e) {
      Alert.alert("Error", "Could not capture photo");
    }
  };

  const removeLivePhoto = (index) => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setLivePhotos(prev => prev.filter((_, i) => i !== index));
          }
        }
      ]
    );
  };

  const submitVerification = () => {
    if (!frontId || !backId) {
      Alert.alert("Error", "Front & Back ID are required");
      return;
    }

    setFormData(prev => ({
      ...prev,
      verification_status: 'submitted'
    }));

    setIsVerifyModalOpen(false);
    Alert.alert("Success", "Verification documents submitted successfully");
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'submitted': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Verified';
      case 'rejected': return 'Rejected';
      case 'submitted': return 'Under Review';
      default: return 'Not Verified';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={[styles.editButton, isEditing && styles.editingButton]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={[styles.editButtonText, isEditing && styles.editingText]}>
            {isEditing ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{formData.fullname}</Text>
          <Text style={styles.role}>{isHost ? '🏠 Host' : '👤 Guest'}</Text>
          
          {/* Display Gender if available */}
          {formData.gender ? (
            <View style={styles.genderBadge}>
              <Text style={styles.genderBadgeText}>👤 {formData.gender}</Text>
            </View>
          ) : null}

          {/* Display Address if available */}
          {formData.address ? (
            <View style={styles.addressBadge}>
              <Text style={styles.addressBadgeText}>📍 {formData.address}</Text>
            </View>
          ) : null}
          
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(formData.verification_status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(formData.verification_status) }]}>
              {getStatusText(formData.verification_status)}
            </Text>
          </View>
        </View>

        {/* Bio Section */}
        {(formData.bio || isEditing) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            {isEditing ? (
              <TextInput
                style={styles.bioInput}
                multiline
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChangeText={(text) => handleInputChange('bio', text)}
              />
            ) : (
              <Text style={styles.bioText}>{formData.bio}</Text>
            )}
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {isEditing ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fullname}
                  onChangeText={(text) => handleInputChange('fullname', text)}
                  placeholder="Enter your full name"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  placeholder="Enter your email"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phonenumber}
                  onChangeText={(text) => handleInputChange('phonenumber', text)}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderSelector}>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderButton,
                        formData.gender === gender && styles.genderButtonSelected
                      ]}
                      onPress={() => handleInputChange('gender', gender)}
                    >
                      <Text
                        style={[
                          styles.genderButtonText,
                          formData.gender === gender && styles.genderButtonTextSelected
                        ]}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  placeholder="Enter your address"
                  multiline
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📧</Text>
                <Text style={styles.infoText}>{formData.email}</Text>
              </View>
              {formData.phonenumber ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📱</Text>
                  <Text style={styles.infoText}>{formData.phonenumber}</Text>
                </View>
              ) : null}
              {formData.gender ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>👤</Text>
                  <Text style={styles.infoText}>{formData.gender}</Text>
                </View>
              ) : null}
              {formData.address ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={styles.infoText}>{formData.address}</Text>
                </View>
              ) : null}
            </>
          )}
        </View>

        {/* Verification Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verification</Text>
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
            <Text style={[styles.verificationStatus, { color: getStatusColor(formData.verification_status) }]}>
              {getStatusText(formData.verification_status)}
            </Text>
          </View>
        </View>

        {/* Habits Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setIsHabitOpen(!isHabitOpen)}
          >
            <Text style={styles.sectionTitle}>Habits</Text>
            <Text style={styles.arrowIcon}>{isHabitOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isHabitOpen && (
            <View style={styles.expandedContent}>
              <View style={styles.habitsContainer}>
                {formData.habbits.map((habbit, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.habbitTag}
                    onPress={() => isEditing && removeHabbit(index)}
                    disabled={!isEditing}
                  >
                    <Text style={styles.habbitText}>{habbit}</Text>
                    {isEditing && <Text style={styles.removeIcon}> ✕</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              {isEditing && (
                <View style={styles.addHabitContainer}>
                  <TextInput
                    style={styles.habitInput}
                    placeholder="Add a new habit..."
                    value={newHabbit}
                    onChangeText={setNewHabbit}
                    onSubmitEditing={addHabbit}
                  />
                  <TouchableOpacity style={styles.addButton} onPress={addHabbit}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Family Members Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setIsFamilyOpen(!isFamilyOpen)}
          >
            <Text style={styles.sectionTitle}>Family Members</Text>
            <Text style={styles.arrowIcon}>{isFamilyOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isFamilyOpen && (
            <View style={styles.expandedContent}>
              {formData.family_members.length === 0 ? (
                <Text style={styles.emptyText}>No family members added yet</Text>
              ) : (
                formData.family_members.map((member, index) => (
                  <View key={index} style={styles.memberCard}>
                    <View style={styles.memberInfo}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberInitial}>
                          {member.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.memberDetails}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberRelation}>
                          {member.relation}{member.age ? ` • ${member.age} years` : ''}
                        </Text>
                        
                        {/* Gender Display */}
                        {member.gender ? (
                          <View style={styles.memberContactRow}>
                            <Text style={styles.memberContactIcon}>👤</Text>
                            <Text style={styles.memberContact}>{member.gender}</Text>
                          </View>
                        ) : null}
                        
                        {/* Address Display */}
                        {member.address ? (
                          <View style={styles.memberContactRow}>
                            <Text style={styles.memberContactIcon}>📍</Text>
                            <Text style={styles.memberContact}>{member.address}</Text>
                          </View>
                        ) : null}
                        
                        {member.email ? (
                          <View style={styles.memberContactRow}>
                            <Text style={styles.memberContactIcon}>📧</Text>
                            <Text style={styles.memberContact}>{member.email}</Text>
                          </View>
                        ) : null}
                        
                        {member.phone ? (
                          <View style={styles.memberContactRow}>
                            <Text style={styles.memberContactIcon}>📱</Text>
                            <Text style={styles.memberContact}>{member.phone}</Text>
                          </View>
                        ) : null}
                        
                        {member.bio ? (
                          <Text style={styles.memberBio} numberOfLines={2}>{member.bio}</Text>
                        ) : null}
                      </View>
                    </View>
                    
                    {isEditing && (
                      <View style={styles.memberActions}>
                        <TouchableOpacity 
                          style={styles.editMemberButton}
                          onPress={() => openEditFamilyModal(index)}
                        >
                          <Text style={styles.editMemberIcon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteMemberButton}
                          onPress={() => removeFamilyMember(index)}
                        >
                          <Text style={styles.deleteMemberIcon}>🗑️</Text>
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
                >
                  <Text style={styles.addFamilyButtonText}>+ Add Family Member</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.switchButton} onPress={handleSwitch}>
            <Text style={styles.switchButtonText}>
              {isHost ? '👤 Switch to Guest' : '🏠 Switch to Host'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Text style={styles.signOutText}>🚪 Log Out</Text>
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
                  <Text style={styles.modalLabel}>Full Name <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter full name"
                    value={newMember.name}
                    onChangeText={(text) => setNewMember({ ...newMember, name: text })}
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Relation <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g., Spouse, Child, Parent"
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
                      keyboardType="email-address"
                      value={newMember.email}
                      onChangeText={(text) => setNewMember({ ...newMember, email: text })}
                    />
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Gender</Text>
                  <View style={styles.genderSelector}>
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderButton,
                          newMember.gender === gender && styles.genderButtonSelected
                        ]}
                        onPress={() => setNewMember({ ...newMember, gender })}
                      >
                        <Text
                          style={[
                            styles.genderButtonText,
                            newMember.gender === gender && styles.genderButtonTextSelected
                          ]}
                        >
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Address</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Address (optional)"
                    value={newMember.address}
                    onChangeText={(text) => setNewMember({ ...newMember, address: text })}
                    multiline
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Phone</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Phone number (optional)"
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
                    multiline
                    numberOfLines={3}
                    value={newMember.bio}
                    onChangeText={(text) => setNewMember({ ...newMember, bio: text })}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => {
                    setIsFamilyModalOpen(false);
                    setEditingMemberIndex(null);
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSubmitButton} onPress={addFamilyMember}>
                  <Text style={styles.modalSubmitButtonText}>
                    {editingMemberIndex !== null ? 'Update Member' : 'Add Member'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Verification Modal */}
        <Modal visible={isVerifyModalOpen} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Identity Verification</Text>
                <TouchableOpacity onPress={() => setIsVerifyModalOpen(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.verifySubtitle}>
                  Please upload clear photos of your identification documents
                </Text>

                <Text style={styles.verifyLabel}>Front ID <Text style={styles.requiredStar}>*</Text></Text>
                <TouchableOpacity 
                  style={[styles.uploadBox, frontId && styles.uploadBoxFilled]} 
                  onPress={() => openImagePicker(setFrontId)}
                >
                  {frontId ? (
                    <Image source={{ uri: frontId }} style={styles.uploadImage} />
                  ) : (
                    <>
                      <Text style={styles.uploadIcon}>📸</Text>
                      <Text style={styles.uploadText}>Tap to upload</Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.verifyLabel}>Back ID <Text style={styles.requiredStar}>*</Text></Text>
                <TouchableOpacity 
                  style={[styles.uploadBox, backId && styles.uploadBoxFilled]} 
                  onPress={() => openImagePicker(setBackId)}
                >
                  {backId ? (
                    <Image source={{ uri: backId }} style={styles.uploadImage} />
                  ) : (
                    <>
                      <Text style={styles.uploadIcon}>📸</Text>
                      <Text style={styles.uploadText}>Tap to upload</Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.verifyLabel}>Passport (Optional)</Text>
                <TouchableOpacity 
                  style={[styles.uploadBox, passport && styles.uploadBoxFilled]} 
                  onPress={() => openImagePicker(setPassport)}
                >
                  {passport ? (
                    <Image source={{ uri: passport }} style={styles.uploadImage} />
                  ) : (
                    <>
                      <Text style={styles.uploadIcon}>📸</Text>
                      <Text style={styles.uploadText}>Tap to upload</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Live Photos Section */}
                <View style={styles.livePhotoSection}>
                  <View style={styles.livePhotoHeader}>
                    <Text style={styles.livePhotoTitle}>Live Photos</Text>
                    <TouchableOpacity style={styles.liveCameraButton} onPress={takeLivePhoto}>
                      <Text style={styles.liveCameraButtonText}>+ Add Photo</Text>
                    </TouchableOpacity>
                  </View>

                  {livePhotos.length === 0 ? (
                    <Text style={styles.livePhotoEmpty}>No live photos captured yet</Text>
                  ) : (
                    <View style={styles.livePhotoGrid}>
                      {livePhotos.map((photo, index) => (
                        <View key={index} style={styles.livePhotoContainer}>
                          <Image source={{ uri: photo.uri }} style={styles.livePhoto} />
                          <View style={styles.livePhotoInfo}>
                            <Text style={styles.livePhotoTime}>{photo.timestamp}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.removePhotoButton}
                            onPress={() => removeLivePhoto(index)}
                          >
                            <Text style={styles.removePhotoIcon}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

              </ScrollView>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsVerifyModalOpen(false)}>
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSubmitButton} onPress={submitVerification}>
                  <Text style={styles.modalSubmitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  editingButton: {
    backgroundColor: '#FF385C',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  editingText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
  },
  cameraIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  genderBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 5,
  },
  genderBadgeText: {
    fontSize: 14,
    color: '#666666',
  },
  addressBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 10,
  },
  addressBadgeText: {
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#666666',
  },
  expandedContent: {
    marginTop: 15,
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
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  infoText: {
    fontSize: 15,
    color: '#4A4A4A',
    flex: 1,
  },
  inputContainer: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    backgroundColor: '#F8F9FA',
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#FF385C',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  genderButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  verificationText: {
    fontSize: 15,
    color: '#4A4A4A',
  },
  verificationStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  habitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  habbitTag: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  habbitText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  removeIcon: {
    fontSize: 14,
    color: '#FF385C',
    marginLeft: 5,
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
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginRight: 10,
    backgroundColor: '#F8F9FA',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  memberInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF385C20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF385C',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  memberRelation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  memberContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  memberContactIcon: {
    fontSize: 12,
    marginRight: 4,
    width: 16,
  },
  memberContact: {
    fontSize: 13,
    color: '#999999',
    flex: 1,
  },
  memberBio: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editMemberButton: {
    padding: 8,
    marginRight: 5,
  },
  editMemberIcon: {
    fontSize: 18,
    color: '#007AFF',
  },
  deleteMemberButton: {
    padding: 8,
  },
  deleteMemberIcon: {
    fontSize: 18,
    color: '#F44336',
  },
  addFamilyButton: {
    borderWidth: 2,
    borderColor: '#FF385C20',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addFamilyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF385C',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  signOutButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 24,
    color: '#999999',
  },
  modalField: {
    marginBottom: 15,
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#F44336',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    backgroundColor: '#F8F9FA',
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#FF385C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verifySubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  verifyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
    marginTop: 5,
  },
  uploadBox: {
    height: 150,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  uploadBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#4CAF50',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
    opacity: 0.5,
  },
  uploadText: {
    fontSize: 14,
    color: '#999999',
  },
  livePhotoSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  livePhotoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  livePhotoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  liveCameraButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  liveCameraButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  livePhotoEmpty: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  livePhotoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  livePhotoContainer: {
    width: (width - 80) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    position: 'relative',
    marginBottom: 8,
  },
  livePhoto: {
    width: '100%',
    height: 120,
  },
  livePhotoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
  },
  livePhotoTime: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F44336',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoIcon: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});