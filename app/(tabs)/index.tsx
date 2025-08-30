
import CardStack from '@/components/CardStack';
import { mockUsers } from '@/data/mockData';
import { CardItem } from '@/types';
import React, { useRef, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height, width } = Dimensions.get('window');

type FeedbackType = 'like' | 'dislike' | 'superlike';

export default function HomeScreen() {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string, type: FeedbackType } | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showFeedback = (message: string, type: FeedbackType) => {
    setFeedback({ message, type });

    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFeedback(null);
    });
  };

  const handleSwipeRight = (item: CardItem) => {
    showFeedback(`Liked ${item.name}`, 'like');
  };

  const handleSwipeLeft = (item: CardItem) => {
    showFeedback(`Disliked ${item.name}`, 'dislike');
  };

  const handleSwipeTop = (item: CardItem) => {
    showFeedback(`Super Liked ${item.name}`, 'superlike');
  };

  const handleAllSwipesCompleted = (swipes: Array<{ item: CardItem, action: string }>) => {
    Alert.alert(`Saving swipes to API: ${swipes}`);
    Alert.alert('Swipes Completed', `You've completed all ${swipes.length} swipes!`);
  };

  const resetStack = () => {
    setResetTrigger(prev => prev + 1);
    setFeedback(null);
    fadeAnim.setValue(0);
  };

  const getFeedbackStyle = () => {
    let backgroundColor = '#4CAF50';
    if (feedback?.type === 'dislike') backgroundColor = '#F44336';
    if (feedback?.type === 'superlike') backgroundColor = '#2196F3';

    return {
      opacity: fadeAnim,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0]
          })
        }
      ],
      backgroundColor
    };
  };

  return (
    <View style={styles.container}>
      {feedback && (
        <Animated.View style={[styles.feedbackContainer, getFeedbackStyle()]}>
          <Text style={styles.feedbackText}>{feedback.message}</Text>
        </Animated.View>
      )}

      <View style={styles.cardContainer}>
        <CardStack
          key={resetTrigger}
          data={mockUsers}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSwipeTop={handleSwipeTop}
          onAllSwipesCompleted={handleAllSwipesCompleted}
        />
        <TouchableOpacity style={styles.resetButton} onPress={resetStack}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View >

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: width * 0.9,
    height: height * 0.7,
    minWidth: 600,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  resetButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedbackContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    zIndex: 100,
  },
  feedbackText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
