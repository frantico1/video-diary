import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteVideo } from "../utils/ffmpegUtils";

// Zustand ile video listesini yönetiyoruz
export const useVideoStore = create((set) => ({
  videos: [], // Başlangıçta boş bir video listesi var

  // Kayıtlı videoları yükleyen fonksiyon
  loadVideos: async () => {
    const storedVideos = await AsyncStorage.getItem("videos"); // AsyncStorage'den videoları al
    if (storedVideos) {
      set({ videos: JSON.parse(storedVideos) }); // Alınan veriyi state'e kaydet
    }
  },

  // Yeni bir video ekleyen fonksiyon
  addVideo: async (video) => {
    set((state) => {
      const newVideos = [...state.videos, video]; // Yeni videoyu listeye ekle
      AsyncStorage.setItem("videos", JSON.stringify(newVideos)); // AsyncStorage'a kaydet
      return { videos: newVideos }; // Yeni state'i döndür
    });
  },

  // Videoyu listeden kaldıran fonksiyon (silme işlemi)
  removeVideo: async (id) => {
    set((state) => {
      const newVideos = state.videos.filter((v) => v.id !== id); // Seçilen videoyu listeden çıkar
      AsyncStorage.setItem("videos", JSON.stringify(newVideos)); // Güncellenmiş listeyi kaydet
      return { videos: newVideos }; // Yeni state'i döndür
    });
  },

  // Videonun bilgilerini güncelleyen fonksiyon (isim ve açıklama değiştirilebilir)
  updateVideo: (id, newName, newDescription, newUri) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id
          ? {
              ...video, // Önceki bilgileri koru
              name: newName, // Yeni ismi kaydet
              description: newDescription, // Yeni açıklamayı kaydet
              uri: newUri, // Yeni URI'yi kaydet
            }
          : video
      ),
    })),

  // Videoyu hem AsyncStorage'den hem de dosya sisteminden silen fonksiyon
  removeVideo: async (id, uri) => {
    await deleteVideo(uri); // Dosya sisteminden videoyu sil
    set((state) => {
      const newVideos = state.videos.filter((v) => v.id !== id); // Listeden kaldır
      AsyncStorage.setItem("videos", JSON.stringify(newVideos)); // Güncellenmiş listeyi kaydet
      return { videos: newVideos }; // Yeni state'i döndür
    });
  },
}));
