package com.nsguruji.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Category model returned by /wp-json/wp/v2/categories.
 */
data class Category(
    @SerializedName("id")
    val id: Long,

    @SerializedName("count")
    val count: Int,

    @SerializedName("description")
    val description: String? = null,

    @SerializedName("link")
    val link: String? = null,

    @SerializedName("name")
    val name: String,

    @SerializedName("slug")
    val slug: String
)
