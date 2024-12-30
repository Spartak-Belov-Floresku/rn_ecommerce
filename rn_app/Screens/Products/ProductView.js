
import { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button } from "react-native";
import { Box, Heading, HStack, VStack } from 'native-base';


const ProductView = props => {

    const [item, setItem] = useState(props.route.params.item);
    const [availability, setAvailability] = useState(false);

    return (
        <Box style={styles.container}>
            <ScrollView style={{marginBottom: 80, padding: 5}}>
                <View>
                    <Image
                        source={{
                            uri: item.image
                                ? item.image
                                : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                        }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Heading style={styles.contentHeader}>{item.name}</Heading>
                    <Text style={styles.contentText}>{item.brand}</Text>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <HStack justifyContent="space-between" alignItems="center" w="100%">
                    <Text style={styles.price}>$ {item.price}</Text>
                    <Button title="Add" />
                </HStack>
            </View>
        </Box>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%'
    },
    imageContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 0
    },
    image: {
        width: '100%',
        height: 250
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader:{
        fontWeight: 'bold',
        marginBottom: 20,
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white'
    },
    price: {
        fontSize: 24,
        margin: 20,
        color: 'red'
    }
})

export default ProductView;