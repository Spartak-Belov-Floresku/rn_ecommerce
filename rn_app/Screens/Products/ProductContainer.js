import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native';
import {
    Box,
    Icon,
    Input,
    Text,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProductList from './ProductList';
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
            setTimeout(() => inputElement?.current?.focus(), 15);
        };
    }, []);

    const searchProduct = text => {
        setProductsFiltered(
            products.filter(i => i.name.toLowerCase().includes(text.toLowerCase()))
        );
    };

    const openList = () => setFocuse(true);
    const onBlure = () => setFocuse(false);

    return (
        <Box flex={1} style={{ backgroundColor: "white" }}>
            <Box
                rounded="lg"
                style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 10,
                }}
            >
                <Input
                    placeholder="Search"
                    variant="filled"
                    bg="gray.300"
                    borderRadius="10"
                    py="2"
                    px="3"
                    onFocus={openList}
                    onBlur={onBlure}
                    onChangeText={text => searchProduct(text)}
                    InputLeftElement={
                        <Icon
                            as={<Ionicons name="search" />}
                            size="5"
                            ml="2"
                            color="gray.800"
                        />
                    }
                />
            </Box>
            {focuse === true ? (
                <SearchedProduct productsFiltered={productsFiltered} />
            ) : (
                <View style={styles.container}>
                    <Text>Products</Text>
                    <View style={styles.listContainer}>
                        <FlatList
                            numColumns={2}
                            data={products}
                            renderItem={({ item }) => (
                                <ProductList key={item.name} item={item} />
                            )}
                            keyExtractor={(item) => item.name}
                        />
                    </View>
                </View>
            )}
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
        marginTop: 15,
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
