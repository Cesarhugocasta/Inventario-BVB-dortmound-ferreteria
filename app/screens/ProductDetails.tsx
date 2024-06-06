import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, View, ImageBackground } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from '../model/Product';
import styles from '../style';

const backgroundImage = { uri: "https://i.pinimg.com/736x/8c/e6/88/8ce68897df5720a305bb2415d52b0c68.jpg" };

export type Params = {
  product: Product;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({ route, navigation }: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product>(undefined!);
  useEffect(() => {
    setProduct(route.params.product);
  }, [route]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.container, { width: '90%' }]}>
          <Text style={styles.header}>{product?.nombre}</Text>
          <View style={styles.row}>
            <Text style={[styles.text, styles.col]}>Existencias:</Text>
            <Text style={[styles.text, styles.colAuto]}>
              <Text
                style={
                  product?.currentStock < product?.minStock
                    ? styles.stockError
                    : null
                }>
                {product?.currentStock}
              </Text>{' '}
              / {product?.maxStock}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.col]}>Precio:</Text>
            <Text style={[styles.text, styles.colAuto]}>
              $ {product?.precio.toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Button
              title="Entrada"
              onPress={() => navigation.push('EntradasScreen', { product })}
            />
            <Button
              title="Salida"
              onPress={() => navigation.push('SalidasScreen', { product })}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default ProductDetails;
