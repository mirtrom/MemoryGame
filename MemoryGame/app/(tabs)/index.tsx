import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Define the number of cards and create an array of icons
const icons = ['coffee', 'apple-alt', 'anchor', 'bell', 'bolt', 'car', 'cloud', 'crown'];
const iconsPairs = [...icons, ...icons]; // Create pairs of icons

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const MemoryGame = () => {
  const [cards, setCards] = useState(shuffleArray(iconsPairs.map((icon, index) => ({
    id: index,
    icon,
    isFlipped: false,
    isMatched: false,
  }))));
  
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [firstCard, secondCard] = selectedCards;

      if (firstCard.icon === secondCard.icon) {
        setCards(prevCards => prevCards.map(card =>
          card.icon === firstCard.icon ? { ...card, isMatched: true } : card
        ));
      } else {
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFlipped: false } : card
          ));
        }, 1000);
      }

      setSelectedCards([]);
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [selectedCards]);

  const handleCardPress = (index: number) => {
    if (selectedCards.length === 2) return;  // Prevent selecting more than two cards at a time

    setCards(prevCards => prevCards.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    ));

    setSelectedCards(prevSelected => [...prevSelected, cards[index]]);
  };

  const resetGame = () => {
    setCards(shuffleArray(iconsPairs.map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }))));
    setSelectedCards([]);
    setMoves(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Game</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.card, item.isFlipped || item.isMatched ? styles.flippedCard : styles.unflippedCard]}
            onPress={() => !item.isFlipped && !item.isMatched && handleCardPress(index)}
          >
            {item.isFlipped || item.isMatched ? (
              <Icon name={item.icon} size={30} color="#fff" />
            ) : (
              <View />
            )}
          </TouchableOpacity>
        )}
      />
      <Text style={styles.moves}>Moves: {moves}</Text>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    width: 60,
    height: 60,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  unflippedCard: {
    backgroundColor: '#444',
  },
  flippedCard: {
    backgroundColor: '#1e90ff',
  },
  moves: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MemoryGame;
