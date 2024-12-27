import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';
import { Text } from 'native-base';

import ProductList from './ProductList';
import SearchBox from '../../Shared/SearchBox';
import Banner from '../../Shared/Banner';
import SearchedProduct from './SearchProducts';
import CategoryFilter from './CategoryFilter';

const data = require('../../assets/data/products.json');
const productCategories = require('../../assets/data/categories.json');

var { height } = Dimensions.get('window');

const ProductContainer = () => {
    const [products, setProducts] = useState(data);
    const [productsFiltered, setProductsFiltered] = useState(data);
    const [focuse, setFocuse] = useState(false);
    const [categories, setCategories] = useState([]);
    const[productsCtg, setProductsCtg] = useState([]);
    const[active, setActive] = useState();
    const [initialState, setInitialState] = useState([]);

    useEffect(() => {
        setProducts(data);
        setProductsFiltered(data);
        setFocuse(false);
        setCategories(productCategories);
        setActive(-1);
        setInitialState(data);

        return () => {
            setProducts([]);
            setProductsFiltered([]);
            setFocuse(false);
            setCategories([]);
            setActive();
            setInitialState([]);
        };
    }, []);

    // Products by category
    const changeCtg = ctg => {
        {
            ctg === 'all'
                ? [setProductsCtg(initialState), setActive(true)]
                : [
                    setProductsCtg(
                        products.filter(
                            product => product.category.$oid === ctg
                        )
                    ),
                    setActive(true)
                ]
        }

    }

    return (
        <View flex={1} style={{ backgroundColor: "white" }}>

            <SearchBox products={products} setFocuse={setFocuse} focuse={focuse} setProductsFiltered={setProductsFiltered} />

            {
                focuse ? (
                    <SearchedProduct productsFiltered={productsFiltered} />
                ) : (
                    <ScrollView>
                        <View>
                            <View>
                                <Banner />
                            </View>
                            <View>
                                <CategoryFilter
                                categories={categories}
                                changeCtg={changeCtg}
                                productsCtg={productsCtg}
                                active={active}
                                setActive={setActive}
                                />
                            </View>
                            {productsCtg.length > 0 ? (
                                <View style={styles.listContainer}>
                                    {
                                        productsCtg.map(
                                            item => <ProductList key={item._id.$oid} item={item} />
                                        )
                                    }
                                </View>
                            ) : (
                                <View style={[styles.center, { height: height / 2}]}>
                                    <Text>No products found!</Text>
                                </View>
                            )}

                        </View>
                    </ScrollView>
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
        height: height,
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro"
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductContainer;
