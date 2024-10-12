import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

const StepIndicator = ({ step, filledFields, totalFields }) => {
    const progress = useRef(new Animated.Value(0)).current; // Initialize Animated.Value

    // Calculate dynamic width for progress bar based on filled fields
    const stepBaseProgress = (step - 1) * 25; // Start with 25% for step 2, 0% for step 1
    const progressPercent = stepBaseProgress + (filledFields / totalFields) * 25; // Each page has 25% progress, with filled fields adding to it

    useEffect(() => {
        // Start the progress bar animation
        Animated.timing(progress, {
            toValue: progressPercent,
            duration: 500,
            useNativeDriver: false, // Required for width animation
        }).start();
    }, [filledFields]);

    // Interpolate the progress bar width
    const progressWidth = progress.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View>
            <View style={styles.progressContainer}>
                {/* Left Section for Step 1 */}
                <View style={styles.leftSection}>
                    <View style={[styles.circle, step === 1 ? styles.activeCircle : styles.completedCircle]}>
                        {step === 1 ? (
                            <Text style={styles.circleText}>1</Text>
                        ) : (
                            <Text style={styles.tickMark}>✔</Text>
                        )}
                    </View>
                    {step === 1 && <Text style={styles.stepLabel}>Applicant</Text>}
                </View>

                {/* Right Section for Steps 2 to 4 */}
                <View style={styles.rightSection}>
                    {/* Step 2 */}
                    <View style={styles.rightStepContainer}>
                        <View style={[styles.circle, step === 2 ? styles.activeCircle : step > 2 ? styles.completedCircle : styles.inactiveCircle]}>
                            {step === 2 ? <Text style={styles.circleText}>2</Text> : step > 2 ? <Text style={styles.tickMark}>✔</Text> : <Text>2</Text>}
                        </View>
                        {step === 2 && <Text style={styles.stepLabel}>Guest Details</Text>}
                    </View>

                    {/* Step 3 */}
                    <View style={styles.rightStepContainer}>
                        <View style={[styles.circle, step === 3 ? styles.activeCircle : step > 3 ? styles.completedCircle : styles.inactiveCircle]}>
                            {step === 3 ? <Text style={styles.circleText}>3</Text> : step > 3 ? <Text style={styles.tickMark}>✔</Text> : <Text>3</Text>}
                        </View>
                        {step === 3 && <Text style={styles.stepLabel}>Visit Details</Text>}
                    </View>

                    {/* Step 4 */}
                    <View style={styles.rightStepContainer}>
                        <View style={[styles.circle, step === 4 ? styles.activeCircle : styles.inactiveCircle]}>
                            {step === 4 ? <Text style={styles.circleText}>4</Text> : <Text>4</Text>}
                        </View>
                        {step === 4 && <Text style={styles.stepLabel}>Verify Details</Text>}
                    </View>
                </View>
            </View>

            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        width: 332, // Updated width
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16, // Added to balance with right section
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '75%', // Adjusted to keep right section equidistant
    },
    rightStepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    activeCircle: {
        backgroundColor: '#9867E9',
    },
    completedCircle: {
        backgroundColor: '#728197',
        width: 19,
        height: 19,
    },
    inactiveCircle: {
        backgroundColor: '#E2E2E2',
    },
    stepLabel: {
        color: '#9867E9',
        fontSize: 16,
        marginRight: 8,
    },
    circleText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    tickMark: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    progressBarContainer: {
        width: 348, // Updated width
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 9,
        marginTop: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#9867E9',
        borderRadius: 9,
    },
});

export default StepIndicator;
