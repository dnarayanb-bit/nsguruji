package com.nsguruji.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Raw WordPress Post model returned by /wp-json/wp/v2/posts.
 */
data class Post(
    @SerializedName("id")
    val id: Long,

    @SerializedName("date")
    val date: String,

    @SerializedName("modified")
    val modified: String? = null,

    @SerializedName("slug")
    val slug: String? = null,

    @SerializedName("link")
    val link: String,

    @SerializedName("title")
    val title: RenderedText,

    @SerializedName("content")
    val content: RenderedText,

    @SerializedName("excerpt")
    val excerpt: RenderedText? = null,

    @SerializedName("author")
    val authorId: Long? = null,

    @SerializedName("featured_media")
    val featuredMediaId: Long? = null,

    @SerializedName("categories")
    val categoryIds: List<Long>? = null,

    @SerializedName("_embedded")
    val embedded: EmbeddedData? = null
)

data class RenderedText(
    @SerializedName("rendered")
    val rendered: String
)

data class EmbeddedData(
    @SerializedName("author")
    val authors: List<AuthorItem>? = null,

    @SerializedName("wp:featuredmedia")
    val featuredMedia: List<MediaItem>? = null,

    @SerializedName("wp:term")
    val terms: List<List<TaxonomyTerm>>? = null
)

data class AuthorItem(
    @SerializedName("id")
    val id: Long,

    @SerializedName("name")
    val name: String,

    @SerializedName("link")
    val link: String? = null
)

data class MediaItem(
    @SerializedName("id")
    val id: Long,

    @SerializedName("source_url")
    val sourceUrl: String? = null,

    @SerializedName("title")
    val title: RenderedText? = null
)

data class TaxonomyTerm(
    @SerializedName("id")
    val id: Long,

    @SerializedName("name")
    val name: String,

    @SerializedName("slug")
    val slug: String,

    @SerializedName("taxonomy")
    val taxonomy: String
)
