import "../global.css";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
  Alert,
} from "react-native";
import { useVideoStore } from "@/state/videoStore";
import { useRouter } from "expo-router";
import VideoPlayerModal from "@/modals/VideoPlayerModal";
import { useState } from "react";

export default function HomeScreen() {
  // Video listesini Zustand store'dan alıyoruz
  const videos = useVideoStore((state) => state.videos);
  // Videoları silmek için Zustand'daki fonksiyonu kullanıyoruz
  const removeVideo = useVideoStore((state) => state.removeVideo);
  // Modalın açık olup olmadığını kontrol eden state
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Silme işlemini gerçekleştiren fonksiyon
  const handleDelete = (id, uri) => {
    Alert.alert(
      "Videoyu Sil",
      "Bu videoyu silmek istediğinizden emin misiniz?",
      [
        { text: "İptal" }, // Kullanıcı iptal ederse hiçbir işlem yapılmaz
        {
          text: "Sil",
          onPress: () => {
            removeVideo(id, uri); // Zustand store'dan video silinir
            Alert.alert("Başarılı", "Video başarıyla silindi!"); // Kullanıcıya başarı mesajı gösterilir
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Video ekleme modalı burada tanımlandı */}
      <VideoPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* Üst Kısım (Başlık ve Açıklama) */}
      <View className="bg-indigo-600 pt-12 pb-4 px-5">
        <Text className="text-2xl font-bold text-white mb-1">
          Video Koleksiyonum
        </Text>
        <Text className="text-white opacity-80">
          Kırpılmış videolarınızı yönetin
        </Text>
      </View>

      {/* İçerik Alanı */}
      <View className="flex-1 p-5">
        {/* Video kırpma butonu */}
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          className="bg-indigo-500 py-3 rounded-lg mb-6 shadow-md"
        >
          <Text className="text-white font-bold text-center">Video Kırp</Text>
        </TouchableOpacity>

        {/* Video sayısını gösteren başlık */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Kırpılmış Videolar
          </Text>
          <Text className="text-sm text-gray-500">{videos.length} video</Text>
        </View>

        {/* Eğer hiç video yoksa gösterilecek boş ekran */}
        {videos.length === 0 ? (
          <View className="flex-1 items-center justify-center py-10">
            <Image
              source={{ uri: "https://placeholder.com/empty-state" }} // Boş ekran görseli
              className="w-24 h-24 opacity-50 mb-4"
            />
            <Text className="text-gray-400 text-lg mb-1">
              Henüz kayıtlı video yok.
            </Text>
            <Text className="text-gray-400 text-sm">
              Video kırpmak için yukarıdaki butona tıklayın
            </Text>
          </View>
        ) : (
          // Video listesini gösteren FlatList bileşeni
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                {/* Videoya tıklanınca detay sayfasına yönlendirme */}
                <TouchableOpacity
                  onPress={() => router.push(`/details?id=${item.id}`)}
                  className="bg-white rounded-lg overflow-hidden"
                >
                  {/* Video sırası ve başlığı */}
                  <View className="bg-indigo-500 px-3 py-2">
                    <Text className="text-white font-medium">
                      {index + 1}. Video
                    </Text>
                  </View>

                  {/* Video bilgileri ve önizleme görseli */}
                  <View className="flex-row p-4">
                    {/* Eğer videonun thumbnail'ı varsa göster */}
                    {item.thumbnail && (
                      <Image
                        source={{ uri: item.thumbnail }}
                        className="w-20 h-20 rounded-md mr-4 bg-gray-200"
                      />
                    )}
                    <View className="flex-1 justify-center">
                      <View className="mb-2">
                        <Text className="text-xs text-gray-500 mb-1">
                          Video Adı
                        </Text>
                        <Text className="font-bold text-gray-800">
                          {item.name}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs text-gray-500 mb-1">
                          Açıklama
                        </Text>
                        <Text className="text-gray-700">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Video silme butonu */}
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.uri)}
                  className="bg-red-500 py-2"
                >
                  <Text className="text-white text-center font-bold">Sil</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
