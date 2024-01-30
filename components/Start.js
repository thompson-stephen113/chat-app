import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground } from "react-native";

const image = require("../assets/background.png");

const Start = ({ navigation }) => {
    // Sets state of name entered by user
    const [name, setName] = useState("");

    // Sets state of chat background selected by user
    const [background, setBackground] = useState("");

    // Stores background colors in an array
    const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.background}>
                <Text style={styles.title}>Chat App</Text>

                <View style={styles.startBox}>
                    {/* Stores entered name in setName */}
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your Name"
                    />

                    <Text style={styles.selectorText}>
                        Choose Background Color:
                    </Text>

                    <View style={styles.colorSelector}>
                        {/* Maps colors from color variable to TouchableOpacity indexes */}
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.colorButton, 
                                    {backgroundColor: color},
                                    background === color && styles.selectedColor
                                ]}
                                onPress={() => setBackground(color)}
                            />                     
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("Chat", { name: name, background: background })}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        flex: 2,
        fontSize: 45,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "center",
        marginTop: 100
    },
    startBox: {
        flex: 2,
        width: "88%",
        height: "44%",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        padding: 10,
        marginBottom: 30
    },
    textInput: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: .5,
        backgroundColor: "#FFFFFF",
        width: "88%",
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    selectorText: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 1,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10
    },
    colorSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 3,
        marginBottom: 15
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 5,
        padding: 10
    },
    selectedColor: {
        borderColor: "#000000",
        borderWidth: 2,
    },
    button: {
        width: "88%",
        alignItems: "center",
        backgroundColor: "#757083",
        padding: 15
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF"
    }
});

export default Start;
