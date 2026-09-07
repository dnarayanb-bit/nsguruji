package com.nsguruji.app.data.api

import com.nsguruji.app.data.model.Category
import com.nsguruji.app.data.model.Post
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * Retrofit interface for nsguruji.com WordPress REST API v2.
 */
interface WordPressApiService {

    /**
     * Fetches paginated list of posts with embedded media and terms.
     */
    @GET("wp-json/wp/v2/posts")
    suspend fun getPosts(
        @Query("page") page: Int = 1,
        @Query("per_page") perPage: Int = 20,
        @Query("search") searchQuery: String? = null,
        @Query("categories") categories: Long? = null,
        @Query("order") order: String = "desc",
        @Query("orderby") orderby: String = "date",
        @Query("_embed") embed: Boolean = true
    ): List<Post>

    /**
     * Fetches single post detail by its post ID.
     */
    @GET("wp-json/wp/v2/posts/{id}")
    suspend fun getPostById(
        @Path("id") id: Long,
        @Query("_embed") embed: Boolean = true
    ): Post

    /**
     * Fetches public taxonomy categories from nsguruji.com.
     */
    @GET("wp-json/wp/v2/categories")
    suspend fun getCategories(
        @Query("per_page") perPage: Int = 50,
        @Query("orderby") orderby: String = "count",
        @Query("order") order: String = "desc"
    ): List<Category>
}
