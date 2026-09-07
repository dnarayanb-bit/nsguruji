plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "com.nsguruji.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.nsguruji.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Production AdMob IDs supplied in prompt
        buildConfigField("String", "PROD_ADMOB_APP_ID", "\"ca-app-pub-3784953261980933~6912378306\"")
        buildConfigField("String", "PROD_BANNER_AD_UNIT_ID", "\"ca-app-pub-3784953261980933/4286214969\"")
        buildConfigField("String", "PROD_INTERSTITIAL_AD_UNIT_ID", "\"ca-app-pub-3784953261980933/6654086959\"")

        // Official Google AdMob Test IDs (safe for development)
        buildConfigField("String", "TEST_BANNER_AD_UNIT_ID", "\"ca-app-pub-3940256099942544/6300978111\"")
        buildConfigField("String", "TEST_INTERSTITIAL_AD_UNIT_ID", "\"ca-app-pub-3940256099942544/1033173712\"")

        manifestPlaceholders["admobAppId"] = "ca-app-pub-3784953261980933~6912378306"
    }

    buildTypes {
        debug {
            isMinifyEnabled = false
            // Default to test ads during debug so developer accounts are never banned
            buildConfigField("Boolean", "USE_TEST_ADS", "true")
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Release builds use real production AdMob IDs
            buildConfigField("Boolean", "USE_TEST_ADS", "false")
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.browser)

    // Image loading
    implementation(libs.coil.compose)

    // Network & REST API
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.gson)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

    // Google AdMob
    implementation(libs.play.services.ads)

    // Debug tooling
    debugImplementation(libs.androidx.ui.tooling)
}
