import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View, ImageBackground} from 'react-native';
import {Product}from '../model/Product';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import LocalDB from '../persistance/localdb';
import styles from '../style';

const backgroundImage = { uri: "https://i.pinimg.com/736x/8c/e6/88/8ce68897df5720a305bb2415d52b0c68.jpg" };

export type MovimientosScreenParams = {

  product: Product;

};

export function EntradasScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EntradasScreen'>>();
  const [product, setProduct] = useState<Product>(undefined!);
  const [cantidad, setCantidad] = useState<number>(0);

  const btnOnPress = function () {
    agregarMovimiento(product, new Date(), cantidad);
    updateStock(product, cantidad);
    navigation.goBack();
  };

  useEffect(() => {
    setProduct(route.params.product);
  }, [route]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
        <View style={styles.container}>
          <Text style={styles.textHeader}>{product?.nombre}</Text>
          <Text style={styles.textLabel}>Cantidad</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={t => setCantidad(Number.parseInt(t, 10))}
          />
          <TouchableOpacity style={styles.button} onPress={btnOnPress}>
            <Text style={styles.buttonText}>Registrar entrada</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export function SalidasScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'EntradasScreen'>>();
  const [product, setProduct] = useState<Product>(undefined!);
  const [cantidad, setCantidad] = useState<number>(0);
  const btnOnPress = function () {
    if (cantidad > product.currentStock) {
      Alert.alert(
        'Cantidad excesiva',
        'La cantidad de salida excede el stock actual',
      );
      return;
    }
    agregarMovimiento(product, new Date(), cantidad * -1);
    updateStock(product, cantidad * -1);
  };
  useEffect(() => {
    setProduct(route.params.product);
  }, [route]);
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <Text style={styles.textHeader}>{product?.nombre}</Text>
          <Text style={styles.textLabel}>Cantidad</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={t => setCantidad(Number.parseInt(t, 10))}
          />
          <TouchableOpacity style={styles.button} onPress={btnOnPress}>
            <Text style={styles.buttonText}>Registrar salida</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

async function agregarMovimiento(
  product: Product,
  fechaHora: Date,
  cantidad: number,
) {
  const db = await LocalDB.connect();
  await db.transaction(async tx => {
    await tx.executeSql(
      'INSERT INTO movimientos (id_producto, fecha_hora, cantidad) VALUES (?, ?, ?)',
      [product.id, fechaHora.toISOString(), cantidad],
      () => {},
      error => console.error(error),
    );
  });
}

async function updateStock(product: Product, cantidad: number) {
  const db = await LocalDB.connect();
  db.transaction(async tx => {
    tx.executeSql(
      'UPDATE productos SET currentStock = (currentStock + ?) WHERE id = ?',
      [cantidad, product.id],
      () => {},
      error => console.error(error),
    );
  });
}
