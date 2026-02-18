import HomeScreen from '@/presentation/features/Product/screens/HomeScreen';
import { ScrollView } from 'react-native';

export default function HomePage() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <HomeScreen />
        </ScrollView>
    );
}
