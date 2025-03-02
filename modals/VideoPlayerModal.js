// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Button,
//   Text,
//   Alert,
//   Modal,
//   TouchableOpacity,
// } from "react-native";
// import { Video } from "expo-av";
// import * as ImagePicker from "expo-image-picker";
// import Slider from "@react-native-community/slider";
// import { checkVideoMetadata, cropVideo } from "../utils/ffmpegUtils";
// import VideoInputForm from "../components/VideoInputForm";
// import { useVideoStore } from "../state/videoStore";

// export default function VideoPlayerModal({ visible, onClose }) {
//   const [videoUri, setVideoUri] = useState(null);
//   const [duration, setDuration] = useState(0);
//   const [startTime, setStartTime] = useState(0);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (!visible) {
//       setVideoUri(null);
//       setStartTime(0);
//       setDuration(0);
//     }
//   }, [visible]);

//   const pickVideo = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: "videos",
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setVideoUri(result.assets[0].uri);
//     }
//   };

//   const onVideoLoad = (status) => {
//     if (status.durationMillis) {
//       setDuration(status.durationMillis / 1000);
//     }
//   };

//   const handleScrub = async (value) => {
//     setStartTime(value);
//     if (videoRef.current) {
//       await videoRef.current.setPositionAsync(value * 1000);
//       await videoRef.current.pauseAsync();
//     }
//   };

//   const addVideo = useVideoStore((state) => state.addVideo);

//   const handleCrop = async (videoName, description) => {
//     if (!videoUri) {
//       Alert.alert("Hata", "Önce bir video seçmelisiniz!");
//       return;
//     }

//     const { videoUri: outputUri, thumbnailUri } = await cropVideo(
//       videoUri,
//       startTime,
//       5,
//       videoName,
//       description
//     );

//     if (outputUri) {
//       addVideo({
//         id: Date.now(),
//         name: videoName,
//         description,
//         uri: outputUri,
//         thumbnail: thumbnailUri, // 🎯 Thumbnail ekledik!
//       });

//       Alert.alert("Başarılı", "Video kırpıldı ve önizleme resmi oluşturuldu!");
//       onClose();
//     } else {
//       Alert.alert("Hata", "Video kırpma işlemi başarısız oldu.");
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent={true}>
//       <View className="flex-1 bg-black/50 justify-center items-center">
//         <View className="w-11/12 bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header */}
//           <View className="bg-indigo-600 p-4 flex-row justify-between items-center">
//             <Text className="text-white font-bold text-lg">Video Kırpma</Text>
//             <TouchableOpacity
//               className="w-8 h-8 bg-white/20 rounded-full justify-center items-center"
//               onPress={onClose}
//             >
//               <Text className="text-white font-bold">X</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Content */}
//           <View className="p-5 items-center">
//             <TouchableOpacity
//               onPress={pickVideo}
//               className="bg-indigo-500 py-3 px-6 rounded-lg mb-6 w-full"
//             >
//               <Text className="text-white font-bold text-center">
//                 Video Seç
//               </Text>
//             </TouchableOpacity>

//             {videoUri ? (
//               <>
//                 <View className="w-full bg-gray-100 rounded-lg overflow-hidden mb-6 items-center">
//                   <Video
//                     ref={videoRef}
//                     source={{ uri: videoUri }}
//                     style={{ width: 300, height: 300 }}
//                     useNativeControls
//                     resizeMode="contain"
//                     isLooping
//                     onPlaybackStatusUpdate={onVideoLoad}
//                   />
//                 </View>

//                 <View className="w-full mb-6">
//                   <View className="flex-row justify-between mb-1">
//                     <Text className="text-gray-700">
//                       Başlangıç:{" "}
//                       <Text className="font-bold">
//                         {startTime.toFixed(1)} sn
//                       </Text>
//                     </Text>
//                     <Text className="text-gray-700">
//                       Bitiş:{" "}
//                       <Text className="font-bold">
//                         {(startTime + 5).toFixed(1)} sn
//                       </Text>
//                     </Text>
//                   </View>

//                   <Slider
//                     style={{ width: "100%", height: 40 }}
//                     minimumValue={0}
//                     maximumValue={duration - 5}
//                     value={startTime}
//                     onSlidingComplete={handleScrub}
//                     minimumTrackTintColor="#4f46e5"
//                     maximumTrackTintColor="#d1d5db"
//                     thumbTintColor="#4f46e5"
//                   />
//                 </View>

//                 <View className="w-full">
//                   <VideoInputForm onSubmit={handleCrop} />
//                 </View>
//               </>
//             ) : (
//               <View className="py-10 items-center">
//                 <Text className="text-gray-400 text-center mb-2">
//                   Kırpmak istediğiniz videoyu seçin
//                 </Text>
//                 <Text className="text-gray-400 text-center text-sm">
//                   Seçilen videodan 5 saniyelik bir kesit oluşturabilirsiniz
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

//----------------------------------------------------------------

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Button,
  Text,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import { checkVideoMetadata, cropVideo } from "../utils/ffmpegUtils";
import VideoInputForm from "../components/VideoInputForm";
import { useVideoStore } from "../state/videoStore";

export default function VideoPlayerModal({ visible, onClose }) {
  // Seçilen videonun URI bilgisini tutar
  const [videoUri, setVideoUri] = useState(null);
  const [duration, setDuration] = useState(0); // Videonun toplam süresi
  const [startTime, setStartTime] = useState(0); // Kesme işleminin başlangıç noktası
  const videoRef = useRef(null); // Video bileşeni için referans

  // Modal kapandığında state'leri sıfırla
  useEffect(() => {
    if (!visible) {
      setVideoUri(null);
      setStartTime(0);
      setDuration(0);
    }
  }, [visible]);

  // Galeriden video seçme fonksiyonu
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "videos", // Sadece videoları göster
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri); // Seçilen videonun yolunu kaydet
    }
  };

  // Video yüklendiğinde süresini al
  const onVideoLoad = (status) => {
    if (status.durationMillis) {
      setDuration(status.durationMillis / 1000); // Milisaniyeyi saniyeye çevir
    }
  };

  // Kullanıcı kaydırıcıyı (slider) hareket ettirdiğinde başlangıç süresini güncelle
  const handleScrub = async (value) => {
    setStartTime(value);
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value * 1000);
      await videoRef.current.pauseAsync();
    }
  };

  // Zustand kullanarak videoyu store'a ekler
  const addVideo = useVideoStore((state) => state.addVideo);

  // Videoyu kırpma ve store'a ekleme fonksiyonu
  const handleCrop = async (videoName, description) => {
    if (!videoUri) {
      Alert.alert("Hata", "Önce bir video seçmelisiniz!");
      return;
    }

    // FFMPEG ile kırpma işlemi yapılıyor
    const { videoUri: outputUri, thumbnailUri } = await cropVideo(
      videoUri,
      startTime,
      5,
      videoName,
      description
    );

    if (outputUri) {
      // Videoyu store'a ekle
      addVideo({
        id: Date.now(),
        name: videoName,
        description,
        uri: outputUri,
        thumbnail: thumbnailUri, // Thumbnail kaydediliyor
      });

      Alert.alert("Başarılı", "Video kırpıldı ve önizleme resmi oluşturuldu!");
      onClose(); // Modalı kapat
    } else {
      Alert.alert("Hata", "Video kırpma işlemi başarısız oldu.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-11/12 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Üst Başlık */}
          <View className="bg-indigo-600 p-4 flex-row justify-between items-center">
            <Text className="text-white font-bold text-lg">Video Kırpma</Text>
            <TouchableOpacity
              className="w-8 h-8 bg-white/20 rounded-full justify-center items-center"
              onPress={onClose}
            >
              <Text className="text-white font-bold">X</Text>
            </TouchableOpacity>
          </View>

          {/* İçerik */}
          <View className="p-5 items-center">
            {/* Video Seçme Butonu */}
            <TouchableOpacity
              onPress={pickVideo}
              className="bg-indigo-500 py-3 px-6 rounded-lg mb-6 w-full"
            >
              <Text className="text-white font-bold text-center">
                Video Seç
              </Text>
            </TouchableOpacity>

            {/* Seçilen video varsa göster */}
            {videoUri ? (
              <>
                {/* Video oynatma alanı */}
                <View className="w-full bg-gray-100 rounded-lg overflow-hidden mb-6 items-center">
                  <Video
                    ref={videoRef}
                    source={{ uri: videoUri }}
                    style={{ width: 300, height: 300 }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={onVideoLoad}
                  />
                </View>

                {/* Kesme süresini ayarlayan kaydırıcı */}
                <View className="w-full mb-6">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-700">
                      Başlangıç:{" "}
                      <Text className="font-bold">
                        {startTime.toFixed(1)} sn
                      </Text>
                    </Text>
                    <Text className="text-gray-700">
                      Bitiş:{" "}
                      <Text className="font-bold">
                        {(startTime + 5).toFixed(1)} sn
                      </Text>
                    </Text>
                  </View>

                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={duration - 5}
                    value={startTime}
                    onSlidingComplete={handleScrub}
                    minimumTrackTintColor="#4f46e5"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#4f46e5"
                  />
                </View>

                {/* Form ile Video Bilgisi Girme */}
                <View className="w-full">
                  <VideoInputForm onSubmit={handleCrop} />
                </View>
              </>
            ) : (
              <View className="py-10 items-center">
                <Text className="text-gray-400 text-center mb-2">
                  Kırpmak istediğiniz videoyu seçin
                </Text>
                <Text className="text-gray-400 text-center text-sm">
                  Seçilen videodan 5 saniyelik bir kesit oluşturabilirsiniz
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
