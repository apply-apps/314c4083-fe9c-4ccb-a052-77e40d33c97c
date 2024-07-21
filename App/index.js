// Filename: index.js
// Combined code from all files

import React from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View, Button, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';

const workouts = [
    { id: '1', name: 'Push-ups', sets: 3, reps: 15, image: 'https://picsum.photos/200/200?random=1' },
    { id: '2', name: 'Squats', sets: 4, reps: 20, image: 'https://picsum.photos/200/200?random=2' },
    { id: '3', name: 'Lunges', sets: 3, reps: 10, image: 'https://picsum.photos/200/200?random=3' },
    { id: '4', name: 'Plank', sets: 5, reps: '1 min', image: 'https://picsum.photos/200/200?random=4' },
    { id: '5', name: 'Burpees', sets: 3, reps: 15, image: 'https://picsum.photos/200/200?random=5' },
];

const WorkoutList = () => {
    return (
        <View style={styles.listContainer}>
            {workouts.map((workout) => (
                <View key={workout.id} style={styles.workoutContainer}>
                    <Image source={{ uri: workout.image }} style={styles.workoutImage} />
                    <View style={styles.workoutDetails}>
                        <Text style={styles.workoutName}>{workout.name}</Text>
                        <Text style={styles.workoutInfo}>Sets: {workout.sets}</Text>
                        <Text style={styles.workoutInfo}>Reps: {workout.reps}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

const App = () => {
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const fetchMessage = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://apihub.p.appply.xyz:3300/motd');
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to fetch the message of the day.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Workout Tracker</Text>
            <Button title="Get Message of the Day" onPress={fetchMessage} />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                message !== '' && <Text style={styles.motd}>{message}</Text>
            )}
            <ScrollView style={styles.scrollView}>
                <WorkoutList />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    motd: {
        fontSize: 16,
        color: '#333',
        marginVertical: 20,
    },
    scrollView: {
        marginTop: 20,
    },
    loader: {
        marginTop: 20,
    },
    listContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    workoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    workoutImage: {
        width: 80,
        height: 80,
        marginRight: 20,
        borderRadius: 10,
    },
    workoutDetails: {
        flex: 1,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    workoutInfo: {
        fontSize: 16,
        color: '#666',
    },
});

export default App;