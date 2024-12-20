import { View, StyleSheet, Dimensions } from 'react-native';
import { FlatList, Box, HStack, VStack, Image, Text, Pressable } from 'native-base';

const { width } = Dimensions.get("window");

const SearchedProduct = (props) => {
    const { productsFiltered } = props;

    const placeholderImage =
        'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png';

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => {
                props.navigation.navigate("Product Detail", { item: item });
            }}
        >
            <HStack
                alignItems="center"
                space={3}
                p={3}
                borderBottomWidth={1}
                borderColor="gray.200"
            >
                {/* Image for Product Thumbnail */}
                <Image
                    source={{ uri: item.image || placeholderImage }}
                    alt="Product Image"
                    size="md"
                    borderRadius="full"
                />
                {/* Product Details */}
                <VStack flex={1}>
                    <Text fontSize="md" bold>
                        {item.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        {item.description}
                    </Text>
                </VStack>
            </HStack>
        </Pressable>
    );

    return (
        <Box style={{ width: width }} flex={1}>
            {productsFiltered.length > 0 ? (
                <FlatList
                    data={productsFiltered}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id.$oid}
                />
            ) : (
                <View style={styles.center}>
                    <Text style={{ alignSelf: 'center' }}>
                        No products match the selected criteria
                    </Text>
                </View>
            )}
        </Box>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
});

export default SearchedProduct;
