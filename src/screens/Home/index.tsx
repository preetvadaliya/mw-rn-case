import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from '@src/AppRoutes';
import { Screens } from '@src/constants';
import { Button, View } from 'react-native';
import { styles } from './style';

export const Home: React.FC = () => {
  const { navigate } = useNavigation<AppNavigationProps>();
  return (
    <View style={styles.container}>
      <Button
        title='View Quotes'
        onPress={() => navigate(Screens.LIST_QUOTES)}
      />
      <Button
        title='Create Quote'
        onPress={() => navigate(Screens.CREATE_QUOTE)}
      />
    </View>
  );
};
