import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    // Gets user's location
    const getLocation = async () => {
        // Requests permission to access user's location
        let permissions = await Location.requestForegroundPermissionsAsync();
        
        // If granted, awaits retrieval of location coordinates object
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
        
            // If coordinates are retrieved, they are sent when onSend is executed
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions to read location are not granted");
    };

    // Gets image from media library
    const pickImage = async () => {
        // Requests permission to access user's media library
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // If granted, awaits retrieval of selected image
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions to access images are not granted")
        };
    };

    // Gets image taken by user's device camera
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();

            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions to access camera are not granted")
        }
    }

    // Creates a unique reference string each time a new file is uploaded
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    };

    // Uploads file with a reference to the Storage Cloud and sends it in a message in the chat
    const uploadAndSendImage = async (imageURI) => {
        const uniqueReferenceString = generateReference(imageURI);
        const response = await fetch(imageURI);
        const blob = await response.blob();

        const newUploadRef = ref(storage, uniqueReferenceString);
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref);
            onSend({ image: imageURL });
        });
    }

    // Creates the layout for the Action Sheet menu options
    const actionSheet = useActionSheet();
    const onActionPress = () => {
        const options = ["Choose Image From Library", "Take Photo", "Send Location", "Cancel"];
        const cancelButtonIndex = options.length - 1;

        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                        default:
                }
            },
        );
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: "#b2b2b2",
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: "#b2b2b2",
        fontWeight: "bold",
        fontSize: 10,
        backgroundColor: "transparent",
        textAlign: "center",
    }
});

export default CustomActions;
