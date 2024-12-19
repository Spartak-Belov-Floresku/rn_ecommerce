import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList
} from 'react-native';

import ProductList from './ProductList';

const data = require('../../assets/data/products.json');

const ProductContainer = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(data);
        return () => setProducts([])
    }, [])

  return (
    <View>
        <Text>Products</Text>
        <View style={{marginTop: 50}}>
            <FlatList
                numColumns={2}
                data={products}
                renderItem={
                    ({item}) => <ProductList key={item.name} item={item}/>
                }
                keyExtractor={item => item.name}
            />
        </View>
    </View>
  )
}

export default ProductContainer;
