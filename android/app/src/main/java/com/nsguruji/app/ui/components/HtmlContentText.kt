package com.nsguruji.app.ui.components

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.text.Html
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.method.LinkMovementMethod
import android.text.style.ClickableSpan
import android.text.style.URLSpan
import android.view.View
import android.widget.TextView
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.text.HtmlCompat
import com.nsguruji.app.ui.theme.BrandLightBlue
import com.nsguruji.app.utils.ShareUtils

@Composable
fun HtmlContentText(
    html: String,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val textColor = MaterialTheme.colorScheme.onSurface.toArgb()
    val linkColor = BrandLightBlue.toArgb()

    AndroidView(
        modifier = modifier.fillMaxWidth(),
        factory = { ctx ->
            TextView(ctx).apply {
                textSize = 16f
                setLineSpacing(14f, 1.25f)
                setTextColor(textColor)
                setLinkTextColor(linkColor)
                movementMethod = LinkMovementMethod.getInstance()
                linksClickable = true
            }
        },
        update = { textView ->
            textView.setTextColor(textColor)
            textView.setLinkTextColor(linkColor)

            val spanned: Spanned = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                HtmlCompat.fromHtml(html, HtmlCompat.FROM_HTML_MODE_COMPACT)
            } else {
                @Suppress("DEPRECATION")
                Html.fromHtml(html)
            }

            // Intercept URL clicks so external links open safely via CustomTabs/Browser
            val strBuilder = SpannableStringBuilder(spanned)
            val urls = strBuilder.getSpans(0, spanned.length, URLSpan::class.java)
            for (span in urls) {
                val start = strBuilder.getSpanStart(span)
                val end = strBuilder.getSpanEnd(span)
                val flags = strBuilder.getSpanFlags(span)
                val url = span.url

                val customClick = object : ClickableSpan() {
                    override fun onClick(widget: View) {
                        ShareUtils.openInBrowser(context, url)
                    }
                }
                strBuilder.removeSpan(span)
                strBuilder.setSpan(customClick, start, end, flags)
            }

            textView.text = strBuilder
        }
    )
}
