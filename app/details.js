import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoStore } from "../state/videoStore";
import { Video } from "expo-av";
import { updateVideoMetadata } from "../utils/ffmpegUtils";
import VideoInputForm from "../components/VideoInputForm";
import { useState } from "react";

export default function VideoDetail() {
  const { id } = useLocalSearchParams(); // URL'den gelen video ID'sini alır
  const router = useRouter(); // Sayfa yönlendirme işlemleri için kullanılır
  const videos = useVideoStore((state) => state.videos); // Tüm videoları state'ten alır
  const updateVideo = useVideoStore((state) => state.updateVideo); // Videoyu güncellemek için kullanılan fonksiyon
  const video = videos.find((v) => v.id.toString() === id); // ID'ye göre videoyu bulur
  const [editMode, setEditMode] = useState(false); // Kullanıcının düzenleme modunda olup olmadığını kontrol eder

  if (!video) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center p-6">
        <Text className="text-xl text-gray-500 mb-6">Video bulunamadı!</Text>
        <TouchableOpacity
          onPress={() => router.back()} // Kullanıcıyı ana sayfaya döndürür
          className="bg-indigo-500 py-3 px-6 rounded-lg"
        >
          <Text className="text-white font-bold">Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUpdateMetadata = async (videoName, description) => {
    const updatedUri = await updateVideoMetadata(
      video.uri,
      videoName,
      description
    );

    if (updatedUri) {
      updateVideo(video.id, videoName, description, updatedUri); // Videoyu günceller
      Alert.alert("Başarılı", "Video meta verileri güncellendi!");
      setEditMode(false); // Düzenleme modundan çıkar
    } else {
      Alert.alert("Hata", "Meta verileri güncellenemedi.");
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-indigo-600 pt-12 pb-4 px-5 flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text
            className="text-2xl font-bold text-white mb-1"
            numberOfLines={1}
          >
            {video.name}
          </Text>
          <Text className="text-white opacity-80" numberOfLines={1}>
            {video.description}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setEditMode(!editMode)} // Kullanıcı düzenleme modunu açıp kapatabilir
          className="bg-white/20 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">
            {editMode ? "İptal" : "Düzenle"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-5">
        <View className="bg-white w-full rounded-lg overflow-hidden shadow-md mb-6 items-center">
          <Video
            source={{ uri: video.uri }} // Seçilen videoyu oynatır
            style={{ width: 300, height: 300 }}
            useNativeControls
            resizeMode="contain"
          />

          <View className="p-4 w-full">
            {editMode ? (
              <VideoInputForm
                onSubmit={handleUpdateMetadata} // Kullanıcı düzenlemeyi kaydettiğinde çalışır
                isEdit={editMode}
                name={video.name}
                description={video.description}
                initialValues={{
                  videoName: video.name,
                  description: video.description,
                }}
              />
            ) : (
              <>
                <View className="mb-3">
                  <Text className="text-xs text-gray-500 mb-1">Video Adı</Text>
                  <Text className="font-bold text-gray-800">{video.name}</Text>
                </View>

                <View className="mb-3">
                  <Text className="text-xs text-gray-500 mb-1">Açıklama</Text>
                  <Text className="text-gray-700">{video.description}</Text>
                </View>

                <View className="mb-2">
                  <Text className="text-xs text-gray-500 mb-1">Video ID</Text>
                  <Text className="text-gray-700">{video.id}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.back()} // Kullanıcıyı önceki sayfaya döndürür
          className="bg-indigo-500 py-3 px-8 rounded-lg shadow-sm self-center"
        >
          <Text className="text-white font-bold">Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
