package com.nsguruji.app.data.repository

import com.nsguruji.app.data.model.ArticleUiModel
import com.nsguruji.app.data.model.Category

/**
 * Repository interface defining operations to retrieve news articles and categories.
 */
interface NewsRepository {
    suspend fun getPosts(page: Int = 1, perPage: Int = 20, categoryId: Long? = null): Result<List<ArticleUiModel>>
    suspend fun getCategories(): Result<List<Category>>
    suspend fun searchPosts(query: String, page: Int = 1, perPage: Int = 20): Result<List<ArticleUiModel>>
    suspend fun getPostById(postId: Long): Result<ArticleUiModel>
}
