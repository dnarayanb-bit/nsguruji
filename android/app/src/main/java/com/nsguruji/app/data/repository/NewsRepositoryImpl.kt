package com.nsguruji.app.data.repository

import android.util.Log
import com.nsguruji.app.data.api.RetrofitClient
import com.nsguruji.app.data.api.RssParser
import com.nsguruji.app.data.api.WordPressApiService
import com.nsguruji.app.data.model.ArticleUiModel
import com.nsguruji.app.data.model.Category
import com.nsguruji.app.data.model.toUiModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.ConcurrentHashMap

class NewsRepositoryImpl(
    private val apiService: WordPressApiService = RetrofitClient.apiService
) : NewsRepository {

    private val TAG = "NewsRepository"

    // Fast in-memory cache to allow instant lookup on ArticleDetailScreen
    private val articlesCache = ConcurrentHashMap<Long, ArticleUiModel>()
    private var cachedCategories: List<Category>? = null

    override suspend fun getPosts(
        page: Int,
        perPage: Int,
        categoryId: Long?
    ): Result<List<ArticleUiModel>> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getPosts(
                page = page,
                perPage = perPage,
                categories = categoryId,
                order = "desc",
                orderby = "date",
                embed = true
            )

            val uiModels = response.map { it.toUiModel() }
            uiModels.forEach { articlesCache[it.id] = it }

            Result.success(uiModels)
        } catch (e: Exception) {
            Log.e(TAG, "WordPress REST API failed, trying RSS fallback if first page: ${e.message}")
            if (page == 1 && categoryId == null) {
                try {
                    val rssArticles = RssParser.fetchRssFeed()
                    if (rssArticles.isNotEmpty()) {
                        rssArticles.forEach { articlesCache[it.id] = it }
                        return@withContext Result.success(rssArticles)
                    }
                } catch (rssError: Exception) {
                    Log.e(TAG, "RSS fallback also failed: ${rssError.message}")
                }
            }
            Result.failure(e)
        }
    }

    override suspend fun getCategories(): Result<List<Category>> = withContext(Dispatchers.IO) {
        cachedCategories?.let { return@withContext Result.success(it) }

        try {
            val categories = apiService.getCategories(perPage = 50)
            // Filter out empty or uncategorized if desired, keeping active categories
            val activeCategories = categories.filter { it.count > 0 && it.name.lowercase() != "uncategorized" }
            cachedCategories = activeCategories
            Result.success(activeCategories)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to load categories: ${e.message}")
            Result.failure(e)
        }
    }

    override suspend fun searchPosts(
        query: String,
        page: Int,
        perPage: Int
    ): Result<List<ArticleUiModel>> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getPosts(
                page = page,
                perPage = perPage,
                searchQuery = query,
                embed = true
            )
            val uiModels = response.map { it.toUiModel() }
            uiModels.forEach { articlesCache[it.id] = it }
            Result.success(uiModels)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to search posts: ${e.message}")
            Result.failure(e)
        }
    }

    override suspend fun getPostById(postId: Long): Result<ArticleUiModel> = withContext(Dispatchers.IO) {
        // Return from memory cache if already fetched
        articlesCache[postId]?.let { return@withContext Result.success(it) }

        try {
            val post = apiService.getPostById(postId, embed = true)
            val uiModel = post.toUiModel()
            articlesCache[postId] = uiModel
            Result.success(uiModel)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to fetch post by ID: ${e.message}")
            Result.failure(e)
        }
    }

    companion object {
        val instance: NewsRepositoryImpl by lazy { NewsRepositoryImpl() }
    }
}
