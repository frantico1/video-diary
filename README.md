# Video Günlüğü Uygulaması Dokümantasyonu

Bu doküman, Expo kullanılarak geliştirilen **Video Günlüğü Uygulaması**'nın kurulumunu, kullanımını ve APK oluşturma sürecini açıklamaktadır.

## 1. Kurulum

Projeyi çalıştırmak için aşağıdaki adımları takip edin:

### Gerekli Bağımlılıkları Yükleyin

Aşağıdaki komutları terminalde çalıştırarak bağımlılıkları yükleyin:

```sh
npm install
```

Ayrıca, Expo geliştirme araçlarını yüklemek için aşağıdaki komutu kullanabilirsiniz:

```sh
npm install -g expo-cli
```

### Ortam Değişkenleri ve İzinler

Android cihazlarda video işleme için gerekli izinleri sağladığınızdan emin olun.

## 2. Kullanım

Proje dizininde aşağıdaki komutu çalıştırarak uygulamayı Expo Go üzerinden çalıştırabilirsiniz:

```sh
npx expo start
```

Ardından QR kodu Expo Go uygulamasıyla tarayarak mobil cihazınızda çalıştırabilirsiniz.

## 3. APK Oluşturma

Expo ile uygulamanın APK dosyasını oluşturmak için aşağıdaki adımları takip edin:

1. **Expo Application Services (EAS) kurulu değilse yükleyin:**

   ```sh
   npm install -g eas-cli
   ```

2. **EAS'i başlatın:**

   ```sh
   npx eas-cli init
   ```

3. **Geliştirme veya üretim sürümü için build alın:**

   ```sh
   eas build --platform android
   ```

4. **Build tamamlandıktan sonra APK dosyanızı indirin ve cihazınıza yükleyin.**

## 4. Kullanılan Teknolojiler ve Bağımlılıklar

### Ana Teknolojiler

- **[Expo](https://expo.dev/)** - React Native uygulamalarını kolayca geliştirmek için kullanılan framework.
- **[Expo Router](https://expo.github.io/router/docs)** - Sayfa yönlendirme ve navigasyon için.
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Global state yönetimi için hafif bir çözüm.
- **[Tanstack Query](https://tanstack.com/query/latest)** - Asenkron veri yönetimi için.
- **[FFMPEG](https://ffmpeg.org/)** - Video işleme ve kırpma işlemleri için.
- **[NativeWind](https://www.nativewind.dev/)** - Tailwind CSS'in React Native ile kullanımı için.
- **[Expo Video](https://docs.expo.dev/versions/latest/sdk/video/)** - Video oynatma ve görüntüleme.
- **[Zod](https://zod.dev/)** / **[Yup](https://github.com/jquense/yup)** - Form doğrulama için.

## 5. Önemli Notlar

- **FFMPEG entegrasyonu**, Expo EAS Build kullanılarak test edilmiştir. Geliştirme ortamında çalıştırmadan önce cihazınızın FFMPEG destekleyip desteklemediğini kontrol edin.
- **Zustand ile AsyncStorage kullanımı**, videoların kalıcı olarak saklanmasını sağlar. Eğer videoların kaybolduğunu fark ederseniz, `useEffect` içinde `loadVideos()` çağrıldığından emin olun.
- **Expo Go üzerinden test yaparken**, `eas build` ile alınan APK'nın Expo Go'dan farklı çalışabileceğini unutmayın.

---
