export interface CardItem {
    id: string;
    name: string;
    age: number;
    bio: string;
    image: any;
}

export interface CardProps {
    item: CardItem;
    onSwipeTop?: () => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeBottom?: () => void;
}
