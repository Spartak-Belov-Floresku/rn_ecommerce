import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeNavigator from "./HomeNavigator";

const Tab = createBottomTabNavigator();

const Main = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#e91e63",
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={HomeNavigator} // Replace with your Cart screen component
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="cart" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Admin"
                component={HomeNavigator} // Replace with your Admin screen component
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="cog" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="User"
                component={HomeNavigator} // Replace with your User screen component
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person" color={color} size={30} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default Main;
