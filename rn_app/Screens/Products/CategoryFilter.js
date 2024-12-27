import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Badge, Text } from "native-base";

const CategoryFilter = ({
    categories,
    changeCtg,
    productsCtg,
    active,
    setActive
}) => {
    return (
        <ScrollView
            bounces={true}
            horizontal={true}
            style={{ backgroundColor: "#f2f2f2" }}
        >
            <View style={styles.horizontalContainer}>
                <TouchableOpacity
                    key={1}
                    onPress={() => {
                        changeCtg("all");
                        setActive(-1);
                    }}
                >
                    <Badge
                        style={[
                            styles.center,
                            { margin: 5 },
                            active == -1 ? styles.active : styles.inactive,
                        ]}
                    >
                        <Text style={{ color: "black" }}>All</Text>
                    </Badge>
                </TouchableOpacity>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category._id.$oid}
                        onPress={() => {
                            changeCtg(category._id.$oid);
                            setActive(categories.indexOf(category));
                        }}
                    >
                        <Badge
                            style={[
                                styles.center,
                                { margin: 5 },
                                active == categories.indexOf(category)
                                    ? styles.active
                                    : styles.inactive,
                            ]}
                        >
                            <Text style={{ color: "black" }}>{category.name}</Text>
                        </Badge>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    active: {
        backgroundColor: "#03bafc",
    },
    inactive: {
        backgroundColor: "#a0e1eb",
    },
    horizontalContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default CategoryFilter;
