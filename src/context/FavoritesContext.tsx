import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Book } from "../types/Book";

type FavoritesContextType = {
  favorites: Book[];
  loading: boolean;
  addFavorite: (book: Book) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (book: Book) => Promise<void>;
  isFavorite: (id: string) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  loading: true,
  addFavorite: async () => {},
  removeFavorite: async () => {},
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const STORAGE_KEY = "favorites";

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: Book[] = raw ? JSON.parse(raw) : [];
        setFavorites(parsed);
      } catch (e) {
        console.warn("Failed to load favorites", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next: Book[]) => {
    setFavorites(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to persist favorites", e);
    }
  };

  const addFavorite = async (book: Book) => {
    if (favorites.some((f) => f.id === book.id)) return;
    await persist([...favorites, book]);
  };

  const removeFavorite = async (id: string) => {
    await persist(favorites.filter((f) => f.id !== id));
  };

  const toggleFavorite = async (book: Book) => {
    if (favorites.some((f) => f.id === book.id)) {
      await removeFavorite(book.id);
    } else {
      await addFavorite(book);
    }
  };

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, addFavorite, removeFavorite, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
