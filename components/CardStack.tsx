import { CardItem } from '@/types';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import Card from './Card';

const { width, height } = Dimensions.get('window');

interface CardStackProps {
    data: CardItem[];
    onSwipeRight?: (item: CardItem) => void;
    onSwipeLeft?: (item: CardItem) => void;
    onSwipeTop?: (item: CardItem) => void;
    onSwipeBottom?: (item: CardItem) => void;
    onAllSwipesCompleted?: (swipes: Array<{ item: CardItem, action: string }>) => void;
}

const CardStack: React.FC<CardStackProps> = ({
    data,
    onSwipeRight,
    onSwipeLeft,
    onSwipeTop,
    onSwipeBottom,
    onAllSwipesCompleted
}) => {
    const [index, setIndex] = useState(0);
    const [swipes, setSwipes] = useState<Array<{ item: CardItem, action: string }>>([]);
    const [loading, setLoading] = useState(false);

    const handleSwipe = (swipeFunction: ((item: CardItem) => void) | undefined, item: CardItem, action: string) => {
        setSwipes(prev => [...prev, { item, action }]);

        if (swipeFunction) {
            swipeFunction(item);
        }

        setIndex(prevIndex => prevIndex + 1);
    };

    useEffect(() => {
        if (index >= data.length && data.length > 0 && swipes.length > 0) {
            setLoading(true);

            if (onAllSwipesCompleted) {
                onAllSwipesCompleted(swipes);
            }

            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [index, data.length, swipes, onAllSwipesCompleted]);

    const renderNoMoreCards = () => {
        if (loading) {
            return (
                <View style={styles.noMoreCards}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.loadingText}>Saving your swipes...</Text>
                </View>
            );
        }

        return (
            <View style={styles.noMoreCards}>
                <Text style={styles.noMoreCardsText}>No more profiles</Text>
                <Text style={styles.noMoreCardsSubtext}>Come back later for more matches</Text>
            </View>
        );
    };

    if (index >= data.length) {
        return renderNoMoreCards();
    }

    return (
        <View style={styles.container}>
            {data.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No profiles available</Text>
                    <Text style={styles.emptyStateSubtext}>Check back later for new matches</Text>
                </View>
            )}

            {data.slice(index, index + 5).map((item, i) => {
                if (i === 0) return null;

                return (
                    <View
                        key={`shadow-${item.id}`}
                        style={[
                            styles.cardShadow,
                            {
                                zIndex: -i,
                                top: i * 4,
                                transform: [{ scale: 1 - (i * 0.03) }],
                                opacity: 1 - (i * 0.2)
                            }
                        ]}
                    >
                        <View style={styles.shadowContent}>
                            <View style={styles.shadowImage} />
                            <View style={styles.shadowInfo}>
                                <View style={styles.shadowText} />
                                <View style={[styles.shadowText, { width: '80%' }]} />
                            </View>
                        </View>
                    </View>
                );
            })}

            {data.slice(index).reverse().map((item, i) => {
                const isTop = i === data.length - index - 1;

                return (
                    <Card
                        key={item.id}
                        item={item}
                        onSwipeLeft={isTop ? () => handleSwipe(onSwipeLeft, item, 'dislike') : undefined}
                        onSwipeRight={isTop ? () => handleSwipe(onSwipeRight, item, 'like') : undefined}
                        onSwipeTop={isTop ? () => handleSwipe(onSwipeTop, item, 'superlike') : undefined}
                        onSwipeBottom={isTop ? () => handleSwipe(onSwipeBottom, item, 'pass') : undefined}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        width: width,
        maxHeight: 600,
        position: 'relative',
    },
    noMoreCards: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.7,
        maxHeight: 600,
    },
    noMoreCardsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ccc',
        marginBottom: 10,
    },
    noMoreCardsSubtext: {
        fontSize: 16,
        color: '#999',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4A90E2',
    },
    cardShadow: {
        position: 'absolute',
        width: width * 0.9,
        height: height * 0.8,
        maxHeight: 500,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    shadowContent: {
        flex: 1,
    },
    shadowImage: {
        width: '100%',
        height: '80%',
        backgroundColor: '#e0e0e0',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    shadowInfo: {
        padding: 15,
    },
    shadowText: {
        height: 16,
        backgroundColor: '#e8e8e8',
        borderRadius: 4,
        marginBottom: 8,
        width: '60%',
    },
    emptyState: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        width: width * 0.8,
        height: 200,
    },
    emptyStateText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
    },
});

export default CardStack;
