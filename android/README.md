# NS Guruji - Native Android News Application

Production-ready native Android news and educational updates application for **[NS Guruji](https://nsguruji.com)**, built with 100% Kotlin and Jetpack Compose.

---

## 📱 Features

- **Direct Live WordPress REST API**: Fetches live articles and categories directly from `https://nsguruji.com/wp-json/wp/v2/posts`.
- **Zero Login / No Account Requirement**: Read all news, results, admit cards, and job updates without any signup or registration.
- **Dynamic Category Filtering**: Automatically loads categories from the website (Govt Job, Latest Updates, Govt Schemes, Results, Admit Card, Financial News, etc.).
- **Interactive Search**: Real-time debounced search directly querying nsguruji.com.
- **Rich Article Reader**: High-contrast typography optimized for Hindi/Devanagari text, full HTML rendering with clickable safe external links.
- **Native Share & Browser Options**: One-tap share to WhatsApp/Telegram using Android's native share sheet and Chrome Custom Tabs.
- **AdMob Monetization**: Integrated Google Mobile Ads SDK with banner ads (bottom of Home and Article Detail) and smart frequency-capped interstitial ads (every 3rd article read, never on launch).
- **Offline & Error Resilience**: In-memory caching, pull-to-refresh, HTTP response disk cache, and fallback RSS parser (`https://nsguruji.com/feed/`).
- **Modern Material 3 Theme**: Red and Blue brand palette inspired by the official NS Guruji logo, with light and dark mode support.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Language** | Kotlin 2.0.0 |
| **UI Toolkit** | Jetpack Compose + Material 3 |
| **Architecture** | MVVM (Model-View-ViewModel) + Clean Repository Pattern |
| **Navigation** | Navigation Compose |
| **Networking** | Retrofit 2.11 + OkHttp 4.12 |
| **Image Loading** | Coil Compose 2.7 |
| **Monetization** | Google Mobile Ads SDK (AdMob) 23.3 |
| **Concurrency** | Kotlin Coroutines + StateFlow |
| **Min SDK** | 24 (Android 7.0+) |
| **Target / Compile SDK** | 34 / 35 (Android 14 / 15) |

---

## 🚀 How to Build & Run in Android Studio

### Prerequisites
1. **Android Studio** (Koala 2024.1 or later recommended)
2. **JDK 17** configured as your Gradle JDK
3. **Android SDK 34** installed via SDK Manager

### Steps
1. Open **Android Studio**.
2. Click **File -> Open...** and select this directory (`android/`).
3. Allow Gradle to sync dependencies automatically via Version Catalog (`gradle/libs.versions.toml`).
4. Connect a physical Android device or launch an Android Emulator.
5. Click the green **Run ▶** button in Android Studio, or execute:

```bash
# To build and install Debug APK
./gradlew installDebug

# To assemble standalone Debug APK (outputs to app/build/outputs/apk/debug/app-debug.apk)
./gradlew assembleDebug

# To assemble optimized Release APK
./gradlew assembleRelease

# To generate Play Store Release Bundle (.aab)
./gradlew bundleRelease
```

---

## 🎯 AdMob Configuration

AdMob App ID and Ad Unit IDs are defined in `app/build.gradle.kts` and `AdConfig.kt`:

- **AdMob App ID**: `ca-app-pub-3784953261980933~6912378306`
- **Banner Ad Unit ID**: `ca-app-pub-3784953261980933/4286214969`
- **Interstitial Ad Unit ID**: `ca-app-pub-3784953261980933/6654086959`

> **Note on Test vs Production Ads:**
> - `debug` builds automatically use Google's official AdMob test ad unit IDs (`ca-app-pub-3940256099942544/...`) to safeguard your account against invalid clicks during development.
> - `release` builds automatically switch to your real production ad unit IDs.

---

## 📁 Package & Directory Structure

```
com.nsguruji.app/
├── MainActivity.kt               # Single Activity host with Edge-to-Edge
├── NSGurujiApp.kt                # Application class initializing Mobile Ads SDK
├── ads/
│   ├── AdConfig.kt               # Ad Unit IDs (test vs production)
│   └── AdManager.kt              # Frequency-capped interstitial lifecycle manager
├── data/
│   ├── api/
│   │   ├── WordPressApiService.kt # Retrofit REST interface
│   │   ├── RetrofitClient.kt     # OkHttp client, caching, Gson setup
│   │   └── RssParser.kt          # Fallback XML pull parser for /feed/
│   ├── model/
│   │   ├── Post.kt               # WordPress Post JSON model
│   │   ├── Category.kt           # Taxonomy category model
│   │   └── ArticleUiModel.kt     # Sanitized UI-ready presentation model
│   └── repository/
│       ├── NewsRepository.kt     # Repository interface
│       └── NewsRepositoryImpl.kt # Repository implementation with in-memory caching
├── navigation/
│   ├── Screen.kt                 # Navigation route definitions
│   └── NavGraph.kt               # Compose NavHost
├── ui/
│   ├── components/
│   │   ├── AppTopBar.kt          # Branding top bar with logo
│   │   ├── ArticleCard.kt        # Card item with thumbnail, badge & Hindi text
│   │   ├── FeaturedArticleCard.kt# Hero featured post banner
│   │   ├── CategoryChips.kt      # Horizontal scrolling category filters
│   │   ├── ShimmerLoading.kt     # Shimmer skeleton loader
│   │   ├── ErrorStateView.kt     # No internet screen with retry button
│   │   ├── EmptyStateView.kt     # Empty results view
│   │   ├── HtmlContentText.kt    # Rich HTML renderer with safe link handling
│   │   └── AdBannerView.kt       # AdMob Banner container
│   ├── screens/
│   │   ├── SplashScreen.kt       # Animated splash with brand logo
│   │   ├── HomeScreen.kt         # Feed with Pull-to-Refresh & pagination
│   │   ├── ArticleDetailScreen.kt# Full article view, share & browser actions
│   │   └── SearchScreen.kt       # Instant search screen
│   └── theme/
│       ├── Color.kt              # NS Guruji Red & Blue palette
│       ├── Theme.kt              # Material 3 Light & Dark schemes
│       └── Type.kt               # Hindi-friendly typography scale
└── utils/
    ├── DateFormatter.kt          # Localized Hindi date formatting
    ├── HtmlUtils.kt              # HTML entity decoding & tag stripping
    ├── NetworkUtils.kt           # Connectivity monitor
    └── ShareUtils.kt             # Native share sheet & Custom Tabs launcher
```
