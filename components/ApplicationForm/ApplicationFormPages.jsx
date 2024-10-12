import { useRouter } from 'expo-router';
import { View, Button, ScrollView } from 'react-native';
import useApplicationStore from './formStore';  // Import the Zustand store
import NewApplicationForm from './NewApplicationForm';
import NewApplicationFormP2 from './NewApplicationFormP2';
import NewApplicationFormP3 from './NewApplicationFormP3';
import NewApplicationFormP4 from './NewApplicationFormP4';
import StepIndicator from '../StepIndicator/StepIndicator';

const ApplicationFormPages = () => {
    const router = useRouter(); // Using Expo Router

    // Accessing form data and update functions from Zustand store
    const {
        formData,
        updateFormData,
        updateNestedData,
    } = useApplicationStore();

    // Function to handle navigation between pages
    const handleProceed = (page) => {
        router.push(page);  // Navigate to the specified page
    };

    return (
        <ScrollView>
            <View>
                {/* Page 1: NewApplicationForm */}
                {/* <StepIndicator step={1} progress={progress} filledFields={filledFields} totalFields={totalFields} /> */}
                <NewApplicationForm
                    name={formData.name}
                    age={formData.age}
                    gender={formData.gender}
                    email={formData.email}
                    phone={formData.phone}
                    address={formData.address}
                    aadhar={formData.aadhar}
                    occupation={formData.occupation}
                    guestMembers={formData.guestMembers}
                    onChange={(key, value) => updateFormData(key, value)}
                    onAddressChange={(key, value) => updateNestedData('address', key, value)}
                />
                <Button title="Proceed to Page 2" onPress={() => handleProceed('NewApplicationFormP2')} />

                {/* Page 2: NewApplicationFormP2 */}
                {/* <StepIndicator step={2} progress={progress} filledFields={filledFields} totalFields={totalFields} /> */}
                {/* <NewApplicationFormP2
                    activeGuest={formData.activeGuest}
                    guests={formData.guests}
                    countryCode={formData.guests[0].guestAddress.countryCode}
                    onChangeGuest={(guestIndex, key, value) =>
                        updateNestedData(`guests[${guestIndex}]`, key, value)
                    }
                    onChangeCountryCode={(guestIndex, value) =>
                        updateNestedData(`guests[${guestIndex}].guestAddress`, 'countryCode', value)
                    }
                /> */}
                {/* <Button title="Proceed to Page 3" onPress={() => handleProceed('NewApplicationFormP3')} /> */}

                {/* Page 3: NewApplicationFormP3 */}
                {/* <StepIndicator step={3} progress={progress} filledFields={filledFields} totalFields={totalFields} />
                <NewApplicationFormP3
                    arrivalDate={formData.visitDate}
                    departureDate={formData.departureDate}
                    previouslyVisited={formData.previouslyVisited}
                    previouslyVisitedDate={formData.previousVisitDate}
                    reasonForRevisit={formData.reasonForRevisit}
                    recommendationLetter={formData.recommendationLetter}
                    onChange={(key, value) => updateFormData(key, value)}
                /> */}
                {/* <Button title="Proceed to Page 4" onPress={() => handleProceed('NewApplicationFormP4')} /> */}

                {/* Page 4: NewApplicationFormP4 (Pre-filled with formData) */}
                {/* <NewApplicationFormP4
                    formData={formData}  // Pass all formData to Page 4
                    onChange={(key, value) => updateFormData(key, value)}
                />
                <Button title="Submit" onPress={() => console.log("Submit form data:", formData)} /> */}
            </View>
        </ScrollView>
    );
};

export default ApplicationFormPages;
