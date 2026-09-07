package com.nsguruji.app.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.browser.customtabs.CustomTabsIntent
import androidx.core.content.ContextCompat
import com.nsguruji.app.R

object ShareUtils {

    /**
     * Opens the native Android share sheet with formatted Hindi text and article URL.
     * Matches user specification: "यह खबर NS Guruji पर पढ़ें:\nURL"
     */
    fun shareArticle(context: Context, title: String, url: String) {
        try {
            val shareText = context.getString(R.string.share_article_template, title, url)
            val sendIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TEXT, shareText)
                putExtra(Intent.EXTRA_SUBJECT, title)
                type = "text/plain"
            }
            val chooser = Intent.createChooser(sendIntent, context.getString(R.string.share_sheet_title))
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(chooser)
        } catch (e: Exception) {
            Toast.makeText(context, "शेयर नहीं किया जा सका", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Opens original article URL on nsguruji.com using Chrome Custom Tabs or external browser.
     */
    fun openInBrowser(context: Context, url: String) {
        if (url.isBlank()) return
        try {
            val uri = Uri.parse(url)
            val customTabsIntent = CustomTabsIntent.Builder()
                .setShowTitle(true)
                .setToolbarColor(ContextCompat.getColor(context, R.color.brand_primary_blue))
                .build()

            customTabsIntent.launchUrl(context, uri)
        } catch (_: Exception) {
            // Fallback to standard ACTION_VIEW intent if Custom Tabs fails
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(intent)
            } catch (fallbackError: Exception) {
                Toast.makeText(context, "ब्राउज़र नहीं खोला जा सका", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
