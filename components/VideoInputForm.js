import React from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik"; // Form yönetimi için Formik kütüphanesi kullanılıyor.
import * as Yup from "yup"; // Form doğrulama için Yup kütüphanesi ekleniyor.

// Formdaki alanlar için doğrulama kuralları
const videoSchema = Yup.object().shape({
  videoName: Yup.string()
    .min(3, "Video adı en az 3 karakter olmalı") // En az 3 karakter olmalı
    .max(20, "Video adı en fazla 20 karakter olabilir") // En fazla 20 karakter olabilir
    .required("Video adı zorunludur"), // Boş bırakılamaz
  description: Yup.string()
    .max(100, "Açıklama en fazla 100 karakter olabilir") // Açıklama en fazla 100 karakter olabilir
    .required("Açıklama zorunludur"), // Boş bırakılamaz
});

export default function VideoInputForm({
  onSubmit, // Form gönderildiğinde çağrılacak fonksiyon
  isEdit, // Düzenleme modunda olup olmadığını kontrol ediyor
  name, // Eğer düzenleme yapılıyorsa, önceki video adı
  description, // Eğer düzenleme yapılıyorsa, önceki açıklama
}) {
  return (
    <Formik
      initialValues={{
        videoName: isEdit ? name : "", // Düzenleme modundaysa eski adı göster
        description: isEdit ? description : "", // Düzenleme modundaysa eski açıklamayı göster
      }}
      enableReinitialize={true} // Değerler değiştiğinde formun güncellenmesini sağlar
      validationSchema={videoSchema} // Doğrulama şeması ekleniyor
      onSubmit={(values) => {
        onSubmit(values.videoName, values.description); // Form gönderildiğinde yeni değerler ile fonksiyon çağrılıyor
      }}
    >
      {({
        handleChange, // Input alanındaki değişiklikleri yönetir
        handleBlur, // Input odaktan çıkınca tetiklenir
        handleSubmit, // Form gönderme işlemi
        values, // Input alanlarının mevcut değerleri
        errors, // Doğrulama hataları
        touched, // Kullanıcının inputa dokunup dokunmadığını belirler
      }) => (
        <View className="w-full">
          {/* Video Adı Input Alanı */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1 ml-1">Video Adı</Text>
            <TextInput
              placeholder="Video başlığını girin"
              value={values.videoName} // Mevcut değer
              onChangeText={handleChange("videoName")} // Kullanıcı inputa yazdığında değişikliği alır
              onBlur={handleBlur("videoName")} // Inputtan çıkıldığında dokunulduğunu kaydeder
              className="border border-gray-300 rounded-lg bg-gray-50 px-4 py-3 w-full text-gray-800"
            />
            {touched.videoName && errors.videoName && (
              <Text className="text-red-500 text-xs ml-1 mt-1">
                {errors.videoName} {/* Hata mesajını göster */}
              </Text>
            )}
          </View>

          {/* Açıklama Input Alanı */}
          <View className="mb-6">
            <Text className="text-xs text-gray-500 mb-1 ml-1">Açıklama</Text>
            <TextInput
              placeholder="Video için kısa bir açıklama yazın"
              value={values.description} // Mevcut değer
              onChangeText={handleChange("description")} // Kullanıcı inputa yazdığında değişikliği alır
              onBlur={handleBlur("description")} // Inputtan çıkıldığında dokunulduğunu kaydeder
              multiline={true} // Çok satırlı input
              numberOfLines={3} // 3 satır gösterecek şekilde ayarlandı
              className="border border-gray-300 rounded-lg bg-gray-50 px-4 py-3 w-full text-gray-800"
              textAlignVertical="top" // Yazının üstten başlamasını sağlar
            />
            {touched.description && errors.description && (
              <Text className="text-red-500 text-xs ml-1 mt-1">
                {errors.description} {/* Hata mesajını göster */}
              </Text>
            )}
          </View>

          {/* Formu Gönderme Butonu */}
          <TouchableOpacity
            onPress={handleSubmit} // Butona basıldığında form gönderiliyor
            className="bg-indigo-600 py-3 rounded-lg w-full"
          >
            <Text className="text-white font-bold text-center">
              {isEdit ? "Değişiklikleri Kayıt Et" : "Videoyu Kırp"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}
