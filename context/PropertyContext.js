import React, { createContext, useState } from 'react';

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [propertyData, setPropertyData] = useState({
    id: null,
    name: '',
    propertyType: '',
    structure: '',
    placeType: '',
    status: 'active',
    isActive: true,
    image: null,
    guests: { adults: 1, children: 0, infants: 0 },
    rooms: [],
    amenities: [],
    location: {
      country: '',
      city: '',
      area: '',
      address: '',
      mapPin: '',
      useCurrent: false,
      nearbyPlaces: [],
      latitude: null,
      longitude: null,
      mapImageUrl: '',
    },
    media: { coverImage: '', houseImages: [] },
    description_data: { title: '', highlights: [], text: '' },
    pets_and_habits: { allowed: false, habitsAllowed: false, names: [], habits: [] },
    policies: { cancellation: '', bookingType: 'Booking Request' },
    pricing: { 
      basePrice: 0, 
      cleaningFee: 0, 
      serviceFee: 0, 
      discounts: { weekly: '', monthly: '', custom: '' }, 
      flexibleRates: {} 
    },
    safety: { exteriorCamera: false, noiseMonitor: false, weapons: false },
    services: [],
    available_from: null,
    available_to: null,
    user_id: null,
    created_at: null,
    updated_at: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);

  const updatePropertyData = (key, value) => {
    setPropertyData(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedProperty = (parentKey, key, value) => {
    setPropertyData(prev => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [key]: value },
    }));
  };

  const updateMultiple = (updates) => {
    setPropertyData(prev => ({ ...prev, ...updates }));
  };

  const resetPropertyData = () => {
    setPropertyData({
      id: null,
      name: '',
      propertyType: '',
      structure: '',
      placeType: '',
      status: 'active',
      isActive: true,
      image: null,
      guests: { adults: 1, children: 0, infants: 0 },
      rooms: [],
      amenities: [],
      location: {
        country: '',
        city: '',
        area: '',
        address: '',
        mapPin: '',
        useCurrent: false,
        nearbyPlaces: [],
        latitude: null,
        longitude: null,
        mapImageUrl: '',
      },
      media: { coverImage: '', houseImages: [] },
      description_data: { title: '', highlights: [], text: '' },
      pets_and_habits: { allowed: false, habitsAllowed: false, names: [], habits: [] },
      policies: { cancellation: '', bookingType: 'Booking Request' },
      pricing: { 
        basePrice: 0, 
        cleaningFee: 0, 
        serviceFee: 0, 
        discounts: { weekly: '', monthly: '', custom: '' }, 
        flexibleRates: {} 
      },
      safety: { exteriorCamera: false, noiseMonitor: false, weapons: false },
      services: [],
      available_from: null,
      available_to: null,
      user_id: null,
      created_at: null,
      updated_at: null,
    });
    setIsEditing(false);
    setEditingPropertyId(null);
  };

  return (
    <PropertyContext.Provider
      value={{
        propertyData,
        setPropertyData,
        updatePropertyData,
        updateNestedProperty,
        updateMultiple,
        resetPropertyData,
        isEditing,
        setIsEditing,
        editingPropertyId,
        setEditingPropertyId,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};