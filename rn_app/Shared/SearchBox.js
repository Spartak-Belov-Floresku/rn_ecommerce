import { useRef, useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchBox = ({ products, setFocuse, focuse, setProductsFiltered }) => {

    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const searchProduct = text => {
        setInputValue(text);
        setProductsFiltered(
            products.filter((i) =>
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        );
    };

    const handleFocus = () => setFocuse(true);

    const closeSearch = () => {
        setFocuse(false);
        setInputValue('');
        setProductsFiltered(products);
        inputRef.current.clear();
        inputRef.current.blur();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.iconSearch}>
                <Ionicons name="search" size={24} color="gray" />
            </TouchableOpacity>
            <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Search"
                value={inputValue}
                onFocus={handleFocus}
                onChangeText={text => searchProduct(text)}
            />
            {focuse && (
                <TouchableOpacity onPress={closeSearch} style={styles.iconClose}>
                    <Ionicons name="close-circle" size={24} color="gray" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
    },
    input: {
        flex: 1,
        height: 40,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    iconSearch: {
        marginRight: 10,
    },
    iconClose: {
        marginLeft: 10,
    },
});

export default SearchBox;
