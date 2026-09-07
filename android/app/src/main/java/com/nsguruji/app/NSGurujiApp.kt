package com.nsguruji.app

import android.app.Application
import com.google.android.gms.ads.MobileAds
import com.nsguruji.app.ads.AdManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Base Application class for NS Guruji.
 * Initializes AdMob SDK and pre-loads interstitial ads asynchronously.
 */
class NSGurujiApp : Application() {

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize Mobile Ads SDK in a background thread to prevent blocking main thread
        CoroutineScope(Dispatchers.IO).launch {
            MobileAds.initialize(this@NSGurujiApp) {
                // Preload the first interstitial ad after SDK initialization
                AdManager.preloadInterstitial(this@NSGurujiApp)
            }
        }
    }

    companion object {
        lateinit var instance: NSGurujiApp
            private set
    }
}
