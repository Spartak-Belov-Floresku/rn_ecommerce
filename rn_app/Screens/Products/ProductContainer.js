import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native';

import ProductList from './ProductList';
import SearchBox from '../../Shared/SearchBox';
import Banner from '../../Shared/Banner';
import SearchedProduct from './SearchProducts';
import CategoryFilter from './CategoryFilter';

const data = require('../../assets/data/products.json');
const productCategories = require('../../assets/data/categories.json');

const { height } = Dimensions.get('window');

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
                    setProducts(
                        products.filter(product => product.category._id == ctg),
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
