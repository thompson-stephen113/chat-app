import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { Alert, LogBox } from "react-native";
import Start from "./components/Start";
import Chat from "./components/Chat";

LogBox.ignoreLogs([
	"AsyncStorage has been extracted from",
	"@firebase/auth: Auth"
]);

const Stack = createNativeStackNavigator();

const App = () => {
	// Firebase configuration
	const firebaseConfig = {
		apiKey: "AIzaSyBrRTKw5dJg9vdTSm2Y9sqjUzv-WZzksRQ",
		authDomain: "chat-app-a0702.firebaseapp.com",
		projectId: "chat-app-a0702",
		storageBucket: "chat-app-a0702.appspot.com",
		messagingSenderId: "825914492087",
		appId: "1:825914492087:web:6a6b1ec8facb19b4a83932"
	};
	
	// Initializes Firebase
	const app = initializeApp(firebaseConfig);

	// Initializes Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	// Initializes storage location reference handler
	const storage = getStorage(app);

	// Defines the network connectivity status state
	const connectionStatus = useNetInfo();

	// Displays an alert popup if connection is lost
	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert("Connection lost!");

			// Prevents Firebase from attempting to reconnect to Firestore DB
			disableNetwork(db);
		} else if (connectionStatus.isConnected === true) {
			enableNetwork(db);
		}
	}, [connectionStatus.isConnected]);

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Start"
			>
				<Stack.Screen
					name="Start"
					component={Start}
				/>

				<Stack.Screen
					name="Chat"
				>
					{/* Passes props to Chat component */}
					{props => <Chat
						isConnected={connectionStatus.isConnected}
						db={db}
						storage={storage}
						{...props}
					/>}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
