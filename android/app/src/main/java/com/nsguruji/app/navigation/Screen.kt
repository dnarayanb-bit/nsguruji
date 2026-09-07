package com.nsguruji.app.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Home : Screen("home")
    object Search : Screen("search")
    object ArticleDetail : Screen("article_detail/{articleId}") {
        fun createRoute(articleId: Long): String = "article_detail/$articleId"
    }
}
