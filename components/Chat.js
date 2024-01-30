import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

const Chat = ({ route, navigation }) => {
    const { name, background } = route.params;

    useEffect(() => {
        navigation.setOptions ({ title: name });
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <Text style={styles.chatRoomTitle}>Chat Room</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    chatRoomTitle: {
        width: "88%",
        backgroundColor: "#757083",
        borderColor: "#FFFFFF",
        borderWidth: 2,
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "center",
        padding: 10
    }
});

export default Chat;
