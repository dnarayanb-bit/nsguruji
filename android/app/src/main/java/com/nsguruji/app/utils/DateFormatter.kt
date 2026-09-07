package com.nsguruji.app.utils

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object DateFormatter {
    private val hindiMonths = arrayOf(
        "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
        "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"
    )

    private val inputIsoFormats = listOf(
        SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US),
        SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX", Locale.US),
        SimpleDateFormat("yyyy-MM-dd", Locale.US)
    )

    /**
     * Converts ISO 8601 string to friendly Hindi date format, e.g. "6 सितम्बर 2026"
     */
    fun formatToHindiReadable(isoString: String): String {
        if (isoString.isBlank()) return ""

        var parsedDate: Date? = null
        for (format in inputIsoFormats) {
            try {
                parsedDate = format.parse(isoString)
                if (parsedDate != null) break
            } catch (_: Exception) {
                // Try next format
            }
        }

        if (parsedDate == null) {
            // Return raw trimmed date if parsing fails
            return isoString.split("T").firstOrNull() ?: isoString
        }

        val cal = java.util.Calendar.getInstance()
        cal.time = parsedDate

        val day = cal.get(java.util.Calendar.DAY_OF_MONTH)
        val monthIdx = cal.get(java.util.Calendar.MONTH)
        val year = cal.get(java.util.Calendar.YEAR)

        val monthName = if (monthIdx in hindiMonths.indices) hindiMonths[monthIdx] else ""

        return "$day $monthName $year"
    }
}
