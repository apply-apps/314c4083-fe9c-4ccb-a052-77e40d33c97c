// Filename: index.js
// Combined code from all files

import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';

const Constants = {
    GRID_SIZE: 20,
    CELL_SIZE: 20,
};

const Head = ({ position, size }) => {
    return (
        <View style={{
            width: size,
            height: size,
            backgroundColor: 'green',
            position: 'absolute',
            left: position[0] * size,
            top: position[1] * size
        }} />
    );
}

const Food = ({ position, size }) => {
    return (
        <View style={{
            width: size,
            height: size,
            backgroundColor: 'red',
            position: 'absolute',
            left: position[0] * size,
            top: position[1] * size
        }} />
    );
}

const Tail = ({ elements, size }) => {
    return (
        <>
            {elements.map((element, index) => (
                <View key={index} style={{
                    width: size,
                    height: size,
                    backgroundColor: 'blue',
                    position: 'absolute',
                    left: element[0] * size,
                    top: element[1] * size
                }} />
            ))}
        </>
    );
}

const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const GameLoop = (entities, { touches, dispatch, events }) => {
    let head = entities.head;
    let food = entities.food;
    let tail = entities.tail;

    const move = touches.find(x => x.type === "move");

    if (move && move.event.number > 0) {
        const event = move.event;
        const deltaX = event.pageX - event.locationX;
        const deltaY = event.pageY - event.locationY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) { // Swipe right
                head.xspeed = 1;
                head.yspeed = 0;
            } else { // Swipe left
                head.xspeed = -1;
                head.yspeed = 0;
            }
        } else {
            if (deltaY > 0) { // Swipe down
                head.xspeed = 0;
                head.yspeed = 1;
            } else { // Swipe up
                head.xspeed = 0;
                head.yspeed = -1;
            }
        }
    }

    head.nextMove -= 1;
    if (head.nextMove === 0) {
        head.nextMove = head.updateFrequency;

        if (tail.elements.length > 0) {
            tail.elements = [[...head.position], ...tail.elements.slice(0, -1)];
        }

        head.position[0] += head.xspeed;
        head.position[1] += head.yspeed;

        if (head.position[0] < 0 || head.position[0] >= Constants.GRID_SIZE || head.position[1] < 0 || head.position[1] >= Constants.GRID_SIZE) {
            dispatch({ type: "game-over" });
        }

        for (let i = 0; i < tail.elements.length; i++) {
            if (head.position[0] === tail.elements[i][0] && head.position[1] === tail.elements[i][1]) {
                dispatch({ type: "game-over" });
            }
        }

        if (head.position[0] === food.position[0] && head.position[1] === food.position[1]) {
            tail.elements = [[...head.position], ...tail.elements];
            food.position = [randomBetween(0, Constants.GRID_SIZE - 1), randomBetween(0, Constants.GRID_SIZE - 1)];
            dispatch({ type: "score" });
        }
    }

    return entities;
};

export default function App() {
    const [running, setRunning] = useState(false);
    const [gameEngine, setGameEngine] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        setRunning(false);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <GameEngine
                    ref={(ref) => { setGameEngine(ref); }}
                    style={styles.gameEngine}
                    systems={[GameLoop]}
                    entities={{
                        head: { position: [0, 0], size: 20, xspeed: 1, yspeed: 0, updateFrequency: 10, nextMove: 10, renderer: <Head /> },
                        food: { position: [Math.floor(Math.random() * Constants.GRID_SIZE), Math.floor(Math.random() * Constants.GRID_SIZE)], size: 20, renderer: <Food /> },
                        tail: { size: 20, elements: [], renderer: <Tail /> }
                    }}
                    running={running}
                    onEvent={(e) => {
                        switch (e.type) {
                            case 'game-over':
                                setRunning(false);
                                gameEngine.stop();
                                break;
                            case 'score':
                                setScore(score + 1);
                                break;
                        }
                    }}
                />
                <Text style={styles.score}>Score: {score}</Text>
                {!running &&
                    <Button title="Start Game" onPress={() => {
                        setScore(0);
                        setRunning(true);
                        gameEngine.swap({
                            head: { position: [0, 0], size: 20, xspeed: 1, yspeed: 0, updateFrequency: 10, nextMove: 10, renderer: <Head /> },
                            food: { position: [Math.floor(Math.random() * Constants.GRID_SIZE), Math.floor(Math.random() * Constants.GRID_SIZE)], size: 20, renderer: <Food /> },
                            tail: { size: 20, elements: [], renderer: <Tail /> }
                        });
                        gameEngine.start();
                    }} />
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameEngine: {
        width: Constants.GRID_SIZE * 20,
        height: Constants.GRID_SIZE * 20,
        backgroundColor: '#f3f3f3',
        borderColor: '#333',
        borderWidth: 1,
    },
    score: {
        fontSize: 20,
        margin: 20,
    },
});