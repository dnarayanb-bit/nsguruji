package com.nsguruji.app.ads

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback

/**
 * Manages interstitial ad lifecycle, preloading, and user-friendly frequency capping.
 * Shows interstitial only after a configured number of article clicks (e.g., every 3 articles)
 * and never on initial app launch.
 */
object AdManager {
    private const val TAG = "NSGurujiAdManager"

    // Sensible frequency cap: Show interstitial every 3rd article view
    private const val ARTICLE_CLICKS_FREQUENCY_CAP = 3

    private var interstitialAd: InterstitialAd? = null
    private var isLoading = false
    private var articleViewCount = 0

    /**
     * Preloads an interstitial ad in the background.
     */
    fun preloadInterstitial(context: Context) {
        if (interstitialAd != null || isLoading) {
            return
        }

        isLoading = true
        val adRequest = AdRequest.Builder().build()
        val adUnitId = AdConfig.interstitialAdUnitId

        InterstitialAd.load(
            context,
            adUnitId,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                    isLoading = false
                    Log.d(TAG, "Interstitial ad loaded successfully.")
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    interstitialAd = null
                    isLoading = false
                    Log.w(TAG, "Interstitial ad failed to load: ${loadAdError.message}")
                }
            }
        )
    }

    /**
     * Checks frequency cap and displays interstitial at a natural break (e.g., after reading an article).
     * @param activity Hosting Activity required by AdMob
     * @param onDismiss Callback invoked when ad is dismissed or if no ad was shown
     */
    fun checkAndShowInterstitial(activity: Activity, onDismiss: () -> Unit = {}) {
        articleViewCount++

        // Only attempt to show on exact multiples of frequency cap (e.g., 3, 6, 9...)
        if (articleViewCount % ARTICLE_CLICKS_FREQUENCY_CAP == 0 && interstitialAd != null) {
            val ad = interstitialAd
            ad?.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    Log.d(TAG, "Interstitial ad dismissed.")
                    interstitialAd = null
                    // Immediately preload the next interstitial for future transitions
                    preloadInterstitial(activity.applicationContext)
                    onDismiss()
                }

                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    Log.w(TAG, "Interstitial failed to show: ${adError.message}")
                    interstitialAd = null
                    preloadInterstitial(activity.applicationContext)
                    onDismiss()
                }

                override fun onAdShowedFullScreenContent() {
                    Log.d(TAG, "Interstitial displayed on screen.")
                }
            }

            ad?.show(activity)
        } else {
            // Ensure next ad is preloaded if not ready yet
            if (interstitialAd == null && !isLoading) {
                preloadInterstitial(activity.applicationContext)
            }
            onDismiss()
        }
    }
}
