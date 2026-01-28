import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const Step1Basic = () => {
  const navigation = useNavigation();

  const steps = [
    {
      number: '1',
      title: 'Tell us about your place',
      description: 'Share some basic info, like where it is and how many guests can stay.',
      color: '#FF385C'
    },
    {
      number: '2',
      title: 'Make it stand out',
      description: 'Add 5 or more photos plus a title and description—we\'ll help you out.',
      color: '#008489'
    },
    {
      number: '3',
      title: 'Finish up and publish',
      description: 'Choose a starting price, verify a few details, then publish your listing.',
      color: '#914669'
    }
  ];

  return (
    <View style={styles.container}>
     
      <View style={styles.headerContainer}>
        <Text style={styles.header}>It's easy to get started on Airbnb</Text>
        <Text style={styles.subHeader}>List your space in just 3 simple steps</Text>
      </View>

     
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.number} style={styles.stepItem}>
            <View style={[styles.stepNumberCircle, { backgroundColor: step.color }]}>
              <Text style={styles.stepNumber}>{step.number}</Text>
            </View>
            
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
            
            {index < steps.length - 1 && (
              <View style={styles.verticalLine} />
            )}
          </View>
        ))}
      </View>

    
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('PropertyName')}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // This prevents scrolling
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: height * 0.05, // Responsive padding
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24, // Slightly smaller
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
    lineHeight: 30,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#717171',
    fontWeight: '400',
    textAlign: 'center',
  },
  stepsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginVertical: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    position: 'relative',
    minHeight: 60, // Fixed minimum height
  },
  stepNumberCircle: {
    width: 40, // Smaller
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
    paddingTop: 5,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#717171',
    lineHeight: 18,
  },
  verticalLine: {
    position: 'absolute',
    left: 20, // Half of stepNumberCircle width (40/2)
    top: 40, // Below the circle
    bottom: -15, // Connects to next item
    width: 2,
    backgroundColor: '#e0e0e0',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#FF385C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Step1Basic;
