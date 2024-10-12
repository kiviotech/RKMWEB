

import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import StepIndicator from '../StepIndicator/StepIndicator';
import NewApplicationForm from './NewApplicationForm'; // Import NewApplicationForm
import NewApplicationFormP2 from './NewApplicationFormP2'; // Import NewApplicationFormP2
import NewApplicationFormP3 from './NewApplicationFormP3'; // Import NewApplicationFormP3
import styles from './NewApplicationFormP4Styles'; // Import the CSS file

export class NewApplicationFormP4 extends Component {
  handleProceed = () => {
    // Submit all details logic here
    alert('Form submitted successfully!');
  };

  handleBack = () => {
    this.props.navigation.navigate('NewApplicationFormP3'); // Navigate back to NewApplicationFormP3
  };

  render() {
    const { previousData } = this.props; // Data passed from previous pages

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Step Indicator */}
          <StepIndicator step={4} progress={75} filledFields={12} totalFields={15} />

          {/* NewApplicationForm - Content from Page 1 */}
          <NewApplicationForm previousData={previousData} />

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* NewApplicationFormP2 - Content from Page 2 */}
          <NewApplicationFormP2 previousData={previousData} />

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* NewApplicationFormP3 - Content from Page 3 */}
          <NewApplicationFormP3 previousData={previousData} />

          {/* Back and Submit Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={this.handleProceed}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default NewApplicationFormP4;

