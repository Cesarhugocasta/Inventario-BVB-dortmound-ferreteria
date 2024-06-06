import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, ImageBackground} from 'react-native';
import {Product} from '../model/Product';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {RootStackParamList} from '../../App';
import LocalDB from '../persistance/localdb';
import styles from '../style';

const backgroundImage = { uri: "https://i.pinimg.com/736x/8c/e6/88/8ce68897df5720a305bb2415d52b0c68.jpg" };

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
  navigation: HomeScreenProps;
  route: HomeScreenRoute;
};

function Home({navigation}: HomeProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const productItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.push('ProductDetails', {product: item})}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'column', flexGrow: 9}}>
          <Text style={styles.itemTitle}>{item.nombre}</Text>
          <Text style={styles.itemDetails}>
            Precio: $ {item.precio.toFixed(2)}
          </Text>
        </View>
        <Text
          style={[
            styles.itemBadge,
            item.currentStock < item.minStock ? styles.itemBadgeError : null,
          ]}>
          {item.currentStock}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    LocalDB.init();
    navigation.addListener('focus', async () => {
      try {
        const db = await LocalDB.connect();
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM productos',
            [],
            (_, res) => setProducts(res.rows.raw()),
            error => console.error({error}),
          );
        });
      } catch (error) {
        console.error(error);
      }
    });
  }, [navigation]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={products}
          renderItem={productItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

export default Home;
