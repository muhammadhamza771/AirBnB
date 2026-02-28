import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const mockProperties = [
  {
    id: 1,
    name: 'Cozy Apartment',
    location: 'Rawalpindi',
    price: 45,
    active: true,
    image: 'https://placeimg.com/640/480/arch',
  },
  {
    id: 2,
    name: 'Beach House',
    location: 'Karachi',
    price: 120,
    active: false,
    image: 'https://placeimg.com/640/480/beach',
  },
];

export default function MyPropertiesScreen({ navigation }) {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Replace this with an API call to fetch host properties
    setProperties(mockProperties);
  }, []);

  const confirmDelete = (id) => {
    Alert.alert('Delete property', 'Are you sure you want to delete this property?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDelete(id),
      },
    ]);
  };

  const handleDelete = (id) => {
    // TODO: call API to delete property on server
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleActive = (id) => {
    // TODO: call API to toggle active state
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const handleUpdate = (property) => {
    // Navigate into AddProperty stack to edit — adjust target as your flow expects
    navigation.navigate('AddProperty', {
      screen: 'Step1Basic',
      params: { editProperty: property },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.status, { color: item.active ? '#0a0' : '#a00' }]}>
            {item.active ? 'Active' : 'Inactive'}
          </Text>
        </View>

        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>${item.price} / night</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleUpdate(item)}>
            <Icon name="pencil" size={16} color="#fff" />
            <Text style={styles.actionText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#4caf50' }]}
            onPress={() => handleToggleActive(item.id)}
          >
            <Icon name={item.active ? 'eye-off' : 'eye'} size={16} color="#fff" />
            <Text style={styles.actionText}>{item.active ? 'Deactivate' : 'Activate'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e53935' }]} onPress={() => confirmDelete(item.id)}>
            <Icon name="trash" size={16} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Properties</Text>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  image: { width: '100%', height: 180 },
  info: { padding: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  location: { color: '#666', marginTop: 6 },
  price: { marginTop: 8, fontWeight: '700' },
  status: { fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
});
