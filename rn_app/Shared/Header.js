import { StyleSheet, Image, SafeAreaView } from "react-native"

const Header = () => {
 return(
    <SafeAreaView style={styles.header}>
        <Image
            source={require('../assets/data/Logo.png')}
            resizeMode="contain"
            style={{ height: 50 }}
        />
    </SafeAreaView>
 )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "white"
    }
})

export default Header;