// src/screens/FavoritesScreen.tsx
import React, { JSX, useContext } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FavoritesContext } from "../context/FavoritesContext";
import { Book } from "../types/Book";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function FavoritesScreen(): JSX.Element {
  const { favorites = [], loading } = useContext(FavoritesContext);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: Book }) => (
    <Card style={styles.card} onPress={() => { navigation.navigate("Details", { book: item }) }}>
      <Card.Title title={item.title} subtitle={item.author} />
      <Card.Content>
        <Text numberOfLines={2}>{item.summary}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.center}>
          <ActivityIndicator animating={true} size={48} />
          <Text style={{ marginTop: 8 }}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={[styles.container, { paddingTop: insets.top }]}>
      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Text>No favorites yet. Add some from the Library tab.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
});
