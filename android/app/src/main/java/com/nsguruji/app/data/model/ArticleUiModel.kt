package com.nsguruji.app.data.model

import com.nsguruji.app.utils.DateFormatter
import com.nsguruji.app.utils.HtmlUtils

/**
 * Clean UI representation of a news article used throughout the Compose UI layers.
 */
data class ArticleUiModel(
    val id: Long,
    val title: String,
    val excerpt: String,
    val contentHtml: String,
    val dateIso: String,
    val formattedDate: String,
    val featuredImageUrl: String?,
    val categoryName: String,
    val authorName: String,
    val originalUrl: String
)

/**
 * Mapper extension converting a raw Retrofit [Post] response to a sanitized [ArticleUiModel].
 */
fun Post.toUiModel(): ArticleUiModel {
    val cleanTitle = HtmlUtils.decodeHtmlEntities(title.rendered)
    val cleanExcerpt = HtmlUtils.extractPlainText(excerpt?.rendered ?: "")
    val featuredImg = jetpackFeaturedMediaUrl?.takeIf { it.isNotBlank() }
        ?: embedded?.featuredMedia?.firstOrNull()?.sourceUrl
        ?: HtmlUtils.extractFirstImageUrl(content.rendered)
    val author = embedded?.authors?.firstOrNull()?.name ?: "NS Guruji"
    val category = embedded?.terms?.firstOrNull()?.firstOrNull()?.name ?: "ताज़ा समाचार"

    return ArticleUiModel(
        id = id,
        title = cleanTitle,
        excerpt = cleanExcerpt,
        contentHtml = content.rendered,
        dateIso = date,
        formattedDate = DateFormatter.formatToHindiReadable(date),
        featuredImageUrl = featuredImg,
        categoryName = category,
        authorName = author,
        originalUrl = link
    )
}
