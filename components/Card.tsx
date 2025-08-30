import { CardProps } from '@/types';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    GestureResponderEvent,
    Image,
    PanResponder,
    PanResponderGestureState,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type SwipeDirections = 'left' | 'right' | 'top' | 'bottom';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_OUT_DURATION = 300;

const Card: React.FC<CardProps> = ({
    item,
    onSwipeLeft,
    onSwipeRight,
    onSwipeTop,
    onSwipeBottom
}) => {
    const position = useRef(new Animated.ValueXY()).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gesture) => {
                return Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5;
            },
            onPanResponderMove: (event: GestureResponderEvent, gesture: PanResponderGestureState) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });

                const fadeValue = 1 - Math.min(Math.abs(gesture.dx) / (width * 0.5), 0.5);
                opacity.setValue(fadeValue);
            },
            onPanResponderRelease: (event: GestureResponderEvent, gesture: PanResponderGestureState) => {
                if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
                    const direction = gesture.dx > 0 ? 'right' : 'left';

                    callSwipeHandler(direction);
                    swipeOut(direction);
                } else if (Math.abs(gesture.dy) > SWIPE_THRESHOLD) {
                    const direction = gesture.dy > 0 ? 'bottom' : 'top';

                    callSwipeHandler(direction);
                    swipeOut(direction);
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    const callSwipeHandler = (direction: SwipeDirections) => {
        switch (direction) {
            case 'left':
                onSwipeLeft && onSwipeLeft();
                break;
            case 'right':
                onSwipeRight && onSwipeRight();
                break;
            case 'top':
                onSwipeTop && onSwipeTop();
                break;
            case 'bottom':
                onSwipeBottom && onSwipeBottom();
                break;
        }
    };

    const swipeOut = (direction: SwipeDirections) => {
        const x = direction === 'right' ? width * 1.5 : direction === 'left' ? -width * 1.5 : 0;
        const y = direction === 'top' ? -height * 1.5 : direction === 'bottom' ? height * 1.5 : 0;

        Animated.parallel([
            Animated.spring(position, {
                toValue: { x, y },
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: SWIPE_OUT_DURATION,
                useNativeDriver: true,
            })
        ]).start();
    };

    const resetPosition = () => {
        Animated.parallel([
            Animated.spring(position, {
                toValue: { x: 0, y: 0 },
                friction: 7,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(opacity, {
                toValue: 1,
                friction: 7,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    };

    const getCardStyle = () => {
        return {
            transform: [
                { translateX: position.x },
                { translateY: position.y }
            ],
            opacity: opacity
        };
    };

    return (
        <Animated.View
            style={[styles.card, getCardStyle()]}
            {...panResponder.panHandlers}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}, {item.age}</Text>
                <Text style={styles.bio}>{item.bio}</Text>
            </View>

            <Animated.View
                style={[
                    styles.overlay,
                    styles.likeOverlay,
                    {
                        opacity: position.x.interpolate({
                            inputRange: [0, SWIPE_THRESHOLD],
                            outputRange: [0, 0.8],
                            extrapolate: 'clamp'
                        })
                    }
                ]}
            >
                <Text style={styles.overlayText}>LIKE</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.overlay,
                    styles.dislikeOverlay,
                    {
                        opacity: position.x.interpolate({
                            inputRange: [-SWIPE_THRESHOLD, 0],
                            outputRange: [0.8, 0],
                            extrapolate: 'clamp'
                        })
                    }
                ]}
            >
                <Text style={styles.overlayText}>DISLIKE</Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: width * 0.9,
        height: height * 0.8,
        maxHeight: 500,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'cover',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    infoContainer: {
        padding: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
        color: '#666',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: '100%',
        height: '100%',
    },
    likeOverlay: {
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderWidth: 3,
        borderColor: 'green',
    },
    dislikeOverlay: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderWidth: 3,
        borderColor: 'red',
    },
    overlayText: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
});

export default Card;
