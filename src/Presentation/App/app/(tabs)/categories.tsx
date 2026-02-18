import CategoryScreen from '@/presentation/features/Product/screens/CategoryScreen';
import { ScrollView } from 'react-native';

export default function CategoriesPage() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <CategoryScreen />
        </ScrollView>
    );
}
