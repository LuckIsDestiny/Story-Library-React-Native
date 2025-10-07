import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Book } from '../types/Book';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
} from 'react-native-paper';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('fiction');

  const fetchBooks = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();

      const formatted: Book[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title ?? 'Untitled',
        author:
          (item.volumeInfo.authors && item.volumeInfo.authors[0]) ??
          'Unknown Author',
        summary: item.volumeInfo.description ?? 'No description available.',
      }));

      setBooks(formatted);
    } catch (error) {
      console.error('Failed to fetch books', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(query);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          style={styles.input}
          placeholder="Search books..."
          value={query}
          onChangeText={setQuery}
        />
        <Button
          mode="contained"
          style={styles.searchButton}
          onPress={() => fetchBooks(query)}>
          Search
        </Button>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator animating size="large" />
          <Text style={{ marginTop: 10 }}>Loading books...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Book }) => (
            <Card
              style={styles.card}
              onPress={() => navigation.navigate('Details', { book: item })}>
              <Card.Title title={item.title} subtitle={item.author} />
            </Card>
          )}
          contentContainerStyle={{
            paddingBottom: 80,
            paddingTop: 8,
            paddingHorizontal: 16, 
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    paddingHorizontal: 16, 
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    marginTop: 4,
  },
  card: {
    marginBottom: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
