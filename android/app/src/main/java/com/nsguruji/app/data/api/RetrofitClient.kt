package com.nsguruji.app.data.api

import android.content.Context
import com.google.gson.GsonBuilder
import com.nsguruji.app.BuildConfig
import com.nsguruji.app.NSGurujiApp
import okhttp3.Cache
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private const val BASE_URL = "https://nsguruji.com/"
    private const val CACHE_SIZE = 10L * 1024L * 1024L // 10 MB HTTP cache

    private val okHttpClient: OkHttpClient by lazy {
        val appContext: Context = NSGurujiApp.instance.applicationContext
        val cacheDir = File(appContext.cacheDir, "http_cache")
        val cache = Cache(cacheDir, CACHE_SIZE)

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BASIC
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }

        OkHttpClient.Builder()
            .cache(cache)
            .connectTimeout(25, TimeUnit.SECONDS)
            .readTimeout(25, TimeUnit.SECONDS)
            .writeTimeout(25, TimeUnit.SECONDS)
            .addInterceptor { chain ->
                val original = chain.request()
                val requestBuilder = original.newBuilder()

                if (original.header("User-Agent") == null) {
                    requestBuilder.header("User-Agent", WordPressApiService.STANDARD_USER_AGENT)
                }
                if (original.header("Accept") == null) {
                    requestBuilder.header("Accept", "application/json, text/plain, */*")
                }
                if (original.header("Referer") == null) {
                    requestBuilder.header("Referer", "https://nsguruji.com/")
                }
                if (original.header("Origin") == null) {
                    requestBuilder.header("Origin", "https://nsguruji.com")
                }
                if (original.header("Accept-Language") == null) {
                    requestBuilder.header("Accept-Language", "hi,en-IN;q=0.9,en;q=0.8")
                }

                chain.proceed(requestBuilder.build())
            }
            .addInterceptor(loggingInterceptor)
            .build()
    }

    private val gson = GsonBuilder()
        .setLenient()
        .create()

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }

    val apiService: WordPressApiService by lazy {
        retrofit.create(WordPressApiService::class.java)
    }

    val rawHttpClient: OkHttpClient
        get() = okHttpClient
}
