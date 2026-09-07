package com.nsguruji.app.utils

import android.os.Build
import android.text.Html

object HtmlUtils {

    /**
     * Decodes common HTML entities (e.g. &#8211;, &amp;, &quot;, &nbsp;) into plain text characters.
     */
    fun decodeHtmlEntities(text: String?): String {
        if (text.isNullOrBlank()) return ""
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Html.fromHtml(text, Html.FROM_HTML_MODE_LEGACY).toString().trim()
        } else {
            @Suppress("DEPRECATION")
            Html.fromHtml(text).toString().trim()
        }
    }

    /**
     * Strips all HTML tags and leaves clean readable plain text with standardized whitespace.
     */
    fun extractPlainText(htmlContent: String?): String {
        if (htmlContent.isNullOrBlank()) return ""
        val withoutTags = htmlContent.replace(Regex("<[^>]*>"), " ")
        val decoded = decodeHtmlEntities(withoutTags)
        return decoded.replace(Regex("\\s+"), " ").trim()
    }

    /**
     * Extracts the first image URL from HTML content if present.
     */
    fun extractFirstImageUrl(htmlContent: String?): String? {
        if (htmlContent.isNullOrBlank()) return null
        val imgRegex = Regex("""<img[^>]+src=["']([^"']+)["']""", RegexOption.IGNORE_CASE)
        return imgRegex.find(htmlContent)?.groupValues?.getOrNull(1)
    }
}
