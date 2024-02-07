import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Start from "./components/Start";
import Chat from "./components/Chat";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

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
	
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

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
					{/* Passes db as a prop to Chat component */}
					{props => <Chat db={db} {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
