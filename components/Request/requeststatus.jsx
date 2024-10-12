import {View, Text} from 'react-native'
import styles from "./requeststatusstyle"

export default function requeststatus ({status, date}) {
    return (
        <View style={styles.container}>
            {status === 'rejected' && (
            <View style={styles.rejectedCard}>
            <Text style={styles.rejectedTitle}>Request Rejected</Text>
            <Text style={styles.message}>
                Your application for {date} was rejected. Check your email for more details.
            </Text>
            </View>
       )}

       {/* Expired Request */}
       {status === 'expired' && (
         <View style={styles.expiredCard}>
           <Text style={styles.expiredTitle}>Expired Request</Text>
           <Text style={styles.message}>
             Your application for {date} expired.
           </Text>
         </View>
       )}
        </View>
    )
}



