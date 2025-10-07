import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Book } from "../types/Book";
import { FavoritesContext } from "../context/FavoritesContext";
import { Button, Card, Text } from "react-native-paper";

export default function DetailsScreen({ route }: any) {
  const { book } = route.params as { book: Book };
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const fav = isFavorite(book.id);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={book.title} subtitle={`by ${book.author}`} />
        <Card.Content>
          <Text>{book.summary}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            buttonColor={fav ? "#ff3b30" : "#007AFF"}
            onPress={() => toggleFavorite(book)}
          >
            {fav ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
});
