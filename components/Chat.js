import { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    LogBox
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

LogBox.ignoreLogs([
    "Cannot connect to Metro",
    "@firebase/firestore"
]);

const Chat = ({ db, route, navigation, isConnected, storage }) => {
    // Extracts userID, name, and background color from user selection on Start.js
    const { userID, name, background } = route.params;

    // Sets state of messages
    const [messages, setMessages] = useState([]);

    // Appends new messages to the log of previously sent messages
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    };

    // Customizes the appearance of the Bubble component
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

    // Prevents Gifted Chat from rendering InputToolbar when offline
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    // Passes props to CustomActions component
    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} userID={userID} {...props} />;
    };

    // Renders a map of the user's location in a message bubble
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                />
            );
        }
        return null;
    }

    // Caches message history
    const cacheChat = async (messagestoCache) => {
        try {
            await AsyncStorage.setItem("messages", JSON.stringify(messagestoCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    // Loads cached message history when isConnected is false
    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    };

    let unsubMessages;
    useEffect(() => {
        navigation.setOptions ({ title: name });

        if (isConnected === true) {
            // Unregisters current onSnapshot() listener to avoid registering multiple listeners
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            // Takes a snapshot of the document files from the shoppinglists collection in the database
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            
            unsubMessages = onSnapshot(q, (docs) => {
                // Holds the information from each document
                let newMessages = [];

                // Loops over each object in the collection's documents
                docs.forEach(doc => {
                    // Adds a new object to the newMessages array with the data of each property-value pair
                    newMessages.push({ 
                        id: doc.id, 
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    });
                });

                cacheChat(newMessages);
                setMessages(newMessages);
            });
        } else loadCachedMessages();

        // Cleanup code
        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);

    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <Text style={styles.chatRoomTitle}>Chat Room</Text>

            {/* Displays chat messages */}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
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
