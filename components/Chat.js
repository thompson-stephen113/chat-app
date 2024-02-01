import { useEffect, useState } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
    // Extracts name and background color from user selection on Start.js
    const { name, background } = route.params;

    // Sets state of messages
    const [messages, setMessages] = useState([]);

    // Appends new messages to the log of previously sent messages
    const onSend = (newMessages) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, newMessages));
    };

    // Customizes the appearance of the message bubbles
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    };

    useEffect(() => {
        navigation.setOptions ({ title: name });

        setMessages([
            {
                _id: 1,
                text: "Hello, developer.",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: "This is a system message",
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <Text style={styles.chatRoomTitle}>Chat Room</Text>

            {/* Displays chat messages */}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
                }}
            />

            {/* Prevents keyboard from altering screen layout */}
            {Platform.OS === "ios" ? 
                <KeyboardAvoidingView behavior= "padding" /> : 
                <KeyboardAvoidingView behavior= "height" />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    chatRoomTitle: {
        width: "88%",
        alignSelf: "center",
        backgroundColor: "#757083",
        borderColor: "#FFFFFF",
        borderWidth: 2,
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "center",
        marginTop: 10,
        padding: 10
    }
});

export default Chat;
