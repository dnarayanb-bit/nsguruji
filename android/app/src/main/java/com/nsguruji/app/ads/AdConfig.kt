package com.nsguruji.app.ads

import com.nsguruji.app.BuildConfig

/**
 * AdMob configuration holding production and test Ad Unit IDs.
 * Automatically selects test IDs in debug builds to prevent policy violations.
 */
object AdConfig {
    // Production IDs from user specification
    const val PROD_ADMOB_APP_ID = "ca-app-pub-3784953261980933~6912378306"
    const val PROD_BANNER_AD_UNIT_ID = "ca-app-pub-3784953261980933/4286214969"
    const val PROD_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3784953261980933/6654086959"

    // Official Google Mobile Ads Test Ad Unit IDs
    const val TEST_BANNER_AD_UNIT_ID = "ca-app-pub-3940256099942544/6300978111"
    const val TEST_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712"

    /**
     * Determines whether to use test ads.
     * True by default in Debug builds, False in Release builds.
     */
    val isTestMode: Boolean
        get() = BuildConfig.USE_TEST_ADS

    /**
     * Active banner ad unit ID based on build configuration.
     */
    val bannerAdUnitId: String
        get() = if (isTestMode) TEST_BANNER_AD_UNIT_ID else PROD_BANNER_AD_UNIT_ID

    /**
     * Active interstitial ad unit ID based on build configuration.
     */
    val interstitialAdUnitId: String
        get() = if (isTestMode) TEST_INTERSTITIAL_AD_UNIT_ID else PROD_INTERSTITIAL_AD_UNIT_ID
}
