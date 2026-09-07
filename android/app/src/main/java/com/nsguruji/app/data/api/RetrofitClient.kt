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
                val request = chain.request().newBuilder()
                    .header("User-Agent", "NSGuruji-Android-App/1.0")
                    .header("Accept", "application/json")
                    .build()
                chain.proceed(request)
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
