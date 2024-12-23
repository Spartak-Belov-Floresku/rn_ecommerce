import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native';

import ProductList from './ProductList';
import SearchBox from '../../Shared/SearchBox';
import SearchedProduct from './SearchProducts';

const data = require('../../assets/data/products.json');

const { height } = Dimensions.get('window');

const ProductContainer = () => {
    const [products, setProducts] = useState(data);
    const [productsFiltered, setProductsFiltered] = useState(data);
    const [focuse, setFocuse] = useState(false);

    useEffect(() => {
        setProducts(data);
        setProductsFiltered(data);
        setFocuse(false);

        return () => {
            setProducts([]);
            setProductsFiltered([]);
            setFocuse(false);
        };
    }, []);

    return (
        <View flex={1} style={{ backgroundColor: "white" }}>

            <SearchBox products={products} setFocuse={setFocuse} focuse={focuse} setProductsFiltered={setProductsFiltered} />

            {
                focuse ? (
                    <SearchedProduct productsFiltered={productsFiltered} />
                ) : (
                    <View style={styles.container}>
                        <View style={styles.listContainer}>
                            <FlatList
                                numColumns={2}
                                data={products}
                                renderItem={({ item }) => (
                                    <ProductList key={item.name} item={item} />
                                )}
                                keyExtractor={(item) => item.name}
                                contentContainerStyle={{ paddingBottom: 100 }}
                            />
                        </View>
                    </View>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
        paddingTop: 5,
        marginTop: 5,
    },
    listContainer: {
        height,
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
});

export default ProductContainer;
