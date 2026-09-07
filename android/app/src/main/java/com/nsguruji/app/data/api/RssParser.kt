package com.nsguruji.app.data.api

import android.util.Xml
import com.nsguruji.app.data.model.ArticleUiModel
import com.nsguruji.app.utils.DateFormatter
import com.nsguruji.app.utils.HtmlUtils
import okhttp3.Request
import org.xmlpull.v1.XmlPullParser
import java.io.StringReader

/**
 * Fallback RSS parser for https://nsguruji.com/feed/ if REST API encounters issues.
 */
object RssParser {
    private const val RSS_URL = "https://nsguruji.com/feed/"

    suspend fun fetchRssFeed(): List<ArticleUiModel> {
        val request = Request.Builder()
            .url(RSS_URL)
            .header("User-Agent", WordPressApiService.STANDARD_USER_AGENT)
            .header("Accept", "application/rss+xml, application/xml, text/xml, */*")
            .build()

        val response = RetrofitClient.rawHttpClient.newCall(request).execute()
        if (!response.isSuccessful) return emptyList()

        val xmlString = response.body?.string() ?: return emptyList()
        return parseXml(xmlString)
    }

    private fun parseXml(xmlString: String): List<ArticleUiModel> {
        val articles = mutableListOf<ArticleUiModel>()
        val parser = Xml.newPullParser()
        parser.setInput(StringReader(xmlString))

        var eventType = parser.eventType
        var insideItem = false

        var title = ""
        var link = ""
        var pubDate = ""
        var creator = "NS Guruji"
        var category = "ताज़ा समाचार"
        var description = ""
        var content = ""

        var idCounter = 100000L

        while (eventType != XmlPullParser.END_DOCUMENT) {
            val tagName = parser.name?.lowercase() ?: ""
            when (eventType) {
                XmlPullParser.START_TAG -> {
                    if (tagName == "item") {
                        insideItem = true
                        title = ""
                        link = ""
                        pubDate = ""
                        creator = "NS Guruji"
                        category = "ताज़ा समाचार"
                        description = ""
                        content = ""
                    } else if (insideItem) {
                        when (tagName) {
                            "title" -> title = parser.nextText()
                            "link" -> link = parser.nextText()
                            "pubdate" -> pubDate = parser.nextText()
                            "creator", "dc:creator" -> creator = parser.nextText()
                            "category" -> {
                                val cat = parser.nextText()
                                if (category == "ताज़ा समाचार" && cat.isNotBlank()) {
                                    category = cat
                                }
                            }
                            "description" -> description = parser.nextText()
                            "encoded", "content:encoded" -> content = parser.nextText()
                        }
                    }
                }
                XmlPullParser.END_TAG -> {
                    if (tagName == "item" && insideItem) {
                        insideItem = false
                        idCounter++

                        val finalContent = if (content.isNotBlank()) content else description
                        val cleanTitle = HtmlUtils.decodeHtmlEntities(title)
                        val cleanExcerpt = HtmlUtils.extractPlainText(description)

                        // Extract first image in content if available
                        val imgRegex = Regex("<img[^>]+src=[\"']([^\"']+)[\"']")
                        val imageUrl = imgRegex.find(finalContent)?.groupValues?.getOrNull(1)

                        articles.add(
                            ArticleUiModel(
                                id = idCounter,
                                title = cleanTitle,
                                excerpt = cleanExcerpt,
                                contentHtml = finalContent,
                                dateIso = pubDate,
                                formattedDate = DateFormatter.formatToHindiReadable(pubDate),
                                featuredImageUrl = imageUrl,
                                categoryName = category,
                                authorName = creator,
                                originalUrl = link
                            )
                        )
                    }
                }
            }
            eventType = parser.next()
        }

        return articles
    }
}
