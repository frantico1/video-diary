import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

// Kullanıcıdan dosya ve medya erişim izni isteme fonksiyonu
export const requestPermissions = async () => {
  // Medya kütüphanesi erişim izni isteniyor
  const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

  // Dosya sistemine erişim izni isteniyor
  const { status: fileStatus } = await FileSystem.getPermissionsAsync();

  // Eğer iki izinden biri verilmezse kullanıcı bilgilendirilip ayarlara yönlendirilir
  if (mediaStatus !== "granted" || fileStatus !== "granted") {
    Alert.alert(
      "İzin Gerekli",
      "Videolara erişim izni vermelisiniz. Ayarlara yönlendiriliyorsunuz.",
      [
        { text: "İptal", style: "cancel" }, // Kullanıcı iptal edebilir
        { text: "Ayarlara Git", onPress: () => Linking.openSettings() }, // Kullanıcı ayarlara yönlendirilir
      ]
    );
    return false; // İzin verilmediği için false döndürülür
  }

  return true; // Eğer tüm izinler verildiyse true döndürülür
};
