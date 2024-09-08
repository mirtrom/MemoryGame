import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';  // Import Bootstrap Icons

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
  const [isModalVisible, setModalVisible] = useState(false);  // State for modal visibility

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

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {  // Check if all cards are matched
      setModalVisible(true);  // Show winning modal
    }
  }, [cards]);

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
    setModalVisible(false);  // Hide modal when game is reset
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

      {/* Winning Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalText}>You won the game in {moves} moves!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
              <Text style={styles.modalButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MemoryGame;