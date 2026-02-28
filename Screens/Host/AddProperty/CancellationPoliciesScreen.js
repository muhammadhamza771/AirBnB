import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CancellationPoliciesScreen = ({ navigation }) => {
  const [selected, setSelected] = useState('Flexible');


  const PolicyCard = ({ title, description }) => {
    const isSelected = selected === title;
     const handlenext = () => {
      navigation.nagiavte('');
     }
    const getIcon = () => {
      switch(title) {
        case 'Flexible': return 'calendar-outline';
        case 'Moderate': return 'time-outline';
        case 'Strict': return 'alert-circle-outline';
        default: return 'document-text-outline';
      }
    };

    const getTiming = () => {
      switch(title) {
        case 'Flexible': return '24 hours before';
        case 'Moderate': return '5 days before';
        case 'Strict': return '48 hours after booking';
        default: return '';
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelected(title)}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Icon 
              name={getIcon()} 
              size={24} 
              color={isSelected ? '#2E9BFF' : '#fff'} 
              style={styles.cardIcon}
            />
            <Text style={[styles.cardTitle, isSelected && styles.selectedTitle]}>
              {title}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.checkmark}>
              <Icon name="checkmark-circle" size={24} color="#2E9BFF" />
            </View>
          )}
        </View>
        
        <View style={styles.timingBadge}>
          <Icon name="time" size={14} color="#999" />
          <Text style={styles.timingText}>Free cancellation {getTiming()}</Text>
        </View>
        
        <Text style={styles.cardDescription}>{description}</Text>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cancellation Policy</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Icon name="shield-checkmark" size={40} color="#2E9BFF" />
          <Text style={styles.heroTitle}>Choose your flexibility</Text>
          <Text style={styles.heroSubtitle}>
            Select a cancellation policy that works best for your travel plans
          </Text>
        </View>

        {/* Policy Cards Container */}
        <View style={styles.cardsContainer}>
          <PolicyCard
            title="Flexible"
            description="Book with confidence! Full refund if you cancel up to 24 hours before check-in. After that, you'll receive a 50% refund for any nights not stayed."
          />

          <PolicyCard
            title="Moderate"
            description="Free cancellation up to 5 days before check-in. Cancel within 5 days and get a 50% refund for all nights (excluding service fees)."
          />

          <PolicyCard
            title="Strict"
            description="Cancel within 48 hours of booking for a full refund. After that, no refunds are available unless it's an eligible circumstance."
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Icon name="information-circle" size={20} color="#2E9BFF" />
          <Text style={styles.infoText}>
            Policies may vary based on the host's preferences and local regulations
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
         
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PriceScreen')}
          style={[
            styles.nextButton,
            !selected && styles.nextButtonDisabled
          ]}
          disabled={!selected}
        >
          <Text style={styles.nextText}>Next</Text>
          
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  cardsContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#2E9BFF',
    backgroundColor: '#F0F9FF',
    shadowColor: '#2E9BFF',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedTitle: {
    color: '#2E9BFF',
  },
  checkmark: {
    marginLeft: 'auto',
  },
  timingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  timingText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  cardDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  selectedIndicator: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 155, 255, 0.2)',
  },
  selectedText: {
    color: '#2E9BFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    color: '#2E9BFF',
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 5,
  },
  nextButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#FFB3B0',
    shadowOpacity: 0.1,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default CancellationPoliciesScreen;
