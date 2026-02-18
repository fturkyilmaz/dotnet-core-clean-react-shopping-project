import ProfileScreen from '@/presentation/features/Auth/screens/ProfileScreen';
import { ScrollView } from 'react-native';

export default function ProfilePage() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <ProfileScreen />
        </ScrollView>
    );
}
