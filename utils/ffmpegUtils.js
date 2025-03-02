import { FFmpegKit } from "ffmpeg-kit-react-native";
import * as FileSystem from "expo-file-system";

// Videoyu kırpma ve meta verilerini ekleme fonksiyonu
export const cropVideo = async (
  inputUri,
  startTime,
  duration,
  videoName,
  description
) => {
  try {
    // Kırpılan videoların kaydedileceği klasör oluşturuluyor
    const outputDir = `${FileSystem.documentDirectory}videos/`;
    await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });

    // Kırpılan videonun yolu belirleniyor
    const outputUri = `${outputDir}cropped_${videoName}.mp4`;

    // FFMPEG komutunu oluşturuyoruz (videoyu kırp ve meta verileri ekle)
    const command = `-i "${inputUri}" -ss ${startTime} -t ${duration} -metadata title="${videoName}" -metadata comment="${description}" -c copy "${outputUri}"`;

    // Komut çalıştırılıyor
    await FFmpegKit.execute(command);

    console.log("Video başarıyla kırpıldı ve kaydedildi:", outputUri);

    // Videodan küçük bir önizleme resmi oluşturuluyor
    const thumbnailUri = await generateThumbnail(outputUri, videoName);

    return { videoUri: outputUri, thumbnailUri };
  } catch (error) {
    console.error("Video kırpma hatası:", error);
    return null;
  }
};

// Kayıtlı videoları listeleme fonksiyonu
export const listSavedVideos = async () => {
  try {
    // "videos" klasöründeki dosyalar listeleniyor
    const files = await FileSystem.readDirectoryAsync(
      `${FileSystem.documentDirectory}videos/`
    );
    console.log("Kayıtlı Videolar:", files);
  } catch (error) {
    console.error("Kayıtlı videolar okunamadı:", error);
  }
};

// Videonun meta verilerini güncelleyen fonksiyon
export const updateVideoMetadata = async (videoUri, videoName, description) => {
  try {
    // Güncellenmiş videoların kaydedileceği klasör oluşturuluyor
    const outputDir = `${FileSystem.documentDirectory}videos/`;
    await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });

    // Yeni video yolu belirleniyor
    const outputUri = `${outputDir}updated_${videoName}.mp4`;

    // Meta verileri güncelleme komutu
    const command = `-i "${videoUri}" -metadata title="${videoName}" -metadata comment="${description}" -c copy "${outputUri}"`;

    console.log("FFMPEG meta veri güncelleme komutu:", command);

    // Komut çalıştırılıyor
    await FFmpegKit.execute(command);

    console.log("Meta verileri güncellendi:", outputUri);
    return outputUri;
  } catch (error) {
    console.error("Meta verileri güncelleme hatası:", error);
    return null;
  }
};

// Bir videonun meta verilerini kontrol etme fonksiyonu
export const checkVideoMetadata = async (videoUri) => {
  try {
    // Meta verileri okuma komutu
    const command = `-i "${videoUri}" -f ffmetadata -`;
    const session = await FFmpegKit.execute(command);

    session.getOutput().then((output) => {
      console.log("Video Meta Verileri:", output);
    });
  } catch (error) {
    console.error("Meta verileri okuma hatası:", error);
  }
};

// Videodan küçük bir önizleme (thumbnail) oluşturma fonksiyonu
export const generateThumbnail = async (videoUri, videoName) => {
  try {
    // Thumbnail'lerin kaydedileceği klasör oluşturuluyor
    const outputDir = `${FileSystem.documentDirectory}thumbnails/`;
    await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });

    // Thumbnail kaydetme yolu belirleniyor
    const outputUri = `${outputDir}${videoName}.jpg`;

    // Thumbnail oluşturma komutu (videonun ilk saniyesinden 1 kare al)
    const command = `-i "${videoUri}" -ss 00:00:01 -vframes 1 "${outputUri}"`;

    await FFmpegKit.execute(command);

    console.log("Thumbnail oluşturuldu:", outputUri);
    return outputUri;
  } catch (error) {
    console.error("Thumbnail oluşturma hatası:", error);
    return null;
  }
};

// Videoyu silme fonksiyonu
export const deleteVideo = async (videoUri) => {
  try {
    // Videoyu sil
    await FileSystem.deleteAsync(videoUri, { idempotent: true });
    console.log("Video başarıyla silindi:", videoUri);
    return true;
  } catch (error) {
    console.error("Video silme hatası:", error);
    return false;
  }
};
