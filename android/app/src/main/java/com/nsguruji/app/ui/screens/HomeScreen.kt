package com.nsguruji.app.ui.screens

import android.app.Activity
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nsguruji.app.R
import com.nsguruji.app.ads.AdManager
import com.nsguruji.app.ui.components.AdBannerView
import com.nsguruji.app.ui.components.AppTopBar
import com.nsguruji.app.ui.components.ArticleCard
import com.nsguruji.app.ui.components.CategoryChips
import com.nsguruji.app.ui.components.EmptyStateView
import com.nsguruji.app.ui.components.ErrorStateView
import com.nsguruji.app.ui.components.FeaturedArticleCard
import com.nsguruji.app.ui.components.ShimmerHomeLoadingList
import com.nsguruji.app.ui.theme.BrandPrimaryRed
import com.nsguruji.app.viewmodel.HomeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToArticle: (Long) -> Unit,
    onNavigateToSearch: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()
    val context = LocalContext.current
    val activity = context as? Activity

    // Detect when user scrolls near the bottom to trigger next page load
    val shouldLoadMore by remember {
        derivedStateOf {
            val totalItems = listState.layoutInfo.totalItemsCount
            val lastVisibleItemIndex = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            totalItems > 0 && lastVisibleItemIndex >= totalItems - 3
        }
    }

    LaunchedEffect(shouldLoadMore) {
        if (shouldLoadMore && !uiState.isLoadingMore && !uiState.isEndOfPagination) {
            viewModel.loadNextPage()
        }
    }

    Scaffold(
        topBar = {
            AppTopBar(
                title = stringResource(R.string.title_home),
                showBack = false,
                showSearch = true,
                onSearchClick = onNavigateToSearch
            )
        },
        bottomBar = {
            // Google AdMob banner ad pinned at the bottom
            AdBannerView()
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Horizontal Category Bar
            CategoryChips(
                categories = uiState.categories,
                selectedCategoryId = uiState.selectedCategoryId,
                onCategorySelected = { categoryId ->
                    viewModel.selectCategory(categoryId)
                }
            )

            // Content Area with Pull-to-Refresh
            PullToRefreshBox(
                isRefreshing = uiState.isRefreshing,
                onRefresh = { viewModel.refresh() },
                modifier = Modifier.fillMaxSize()
            ) {
                when {
                    // Initial Shimmer Loading State
                    uiState.isLoading && uiState.posts.isEmpty() -> {
                        ShimmerHomeLoadingList()
                    }

                    // Network Error State
                    uiState.errorMessage != null && uiState.posts.isEmpty() -> {
                        ErrorStateView(
                            onRetry = { viewModel.retry() },
                            customMessage = uiState.errorMessage
                        )
                    }

                    // Empty Articles State
                    uiState.posts.isEmpty() && !uiState.isLoading -> {
                        EmptyStateView(
                            title = stringResource(R.string.empty_articles)
                        )
                    }

                    // Success: Feed with Featured Hero Card & Articles List
                    else -> {
                        val featuredPost = uiState.posts.firstOrNull()
                        val otherPosts = if (uiState.posts.size > 1) uiState.posts.drop(1) else emptyList()

                        LazyColumn(
                            state = listState,
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 10.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            // Featured Article Card (Top)
                            if (featuredPost != null) {
                                item(key = "featured_${featuredPost.id}") {
                                    Column {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.padding(bottom = 8.dp)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(width = 4.dp, height = 16.dp)
                                                    .clip(RoundedCornerShape(2.dp))
                                                    .background(BrandPrimaryRed)
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(
                                                text = stringResource(R.string.section_featured),
                                                style = MaterialTheme.typography.titleMedium.copy(
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 15.sp
                                                ),
                                                color = MaterialTheme.colorScheme.onBackground
                                            )
                                        }

                                        FeaturedArticleCard(
                                            article = featuredPost,
                                            onClick = {
                                                if (activity != null) {
                                                    AdManager.checkAndShowInterstitial(activity) {
                                                        onNavigateToArticle(featuredPost.id)
                                                    }
                                                } else {
                                                    onNavigateToArticle(featuredPost.id)
                                                }
                                            }
                                        )

                                        Spacer(modifier = Modifier.height(14.dp))

                                        if (otherPosts.isNotEmpty()) {
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                modifier = Modifier.padding(bottom = 6.dp)
                                            ) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(width = 4.dp, height = 16.dp)
                                                        .clip(RoundedCornerShape(2.dp))
                                                        .background(BrandPrimaryRed)
                                                )
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Text(
                                                    text = stringResource(R.string.section_latest),
                                                    style = MaterialTheme.typography.titleMedium.copy(
                                                        fontWeight = FontWeight.Bold,
                                                        fontSize = 15.sp
                                                    ),
                                                    color = MaterialTheme.colorScheme.onBackground
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            // Remaining Article Cards
                            items(
                                items = otherPosts,
                                key = { it.id }
                            ) { article ->
                                ArticleCard(
                                    article = article,
                                    onClick = {
                                        if (activity != null) {
                                            AdManager.checkAndShowInterstitial(activity) {
                                                onNavigateToArticle(article.id)
                                            }
                                        } else {
                                            onNavigateToArticle(article.id)
                                        }
                                    }
                                )
                            }

                            // Pagination Loading Indicator
                            if (uiState.isLoadingMore) {
                                item(key = "loading_more") {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(28.dp),
                                            color = MaterialTheme.colorScheme.primary,
                                            strokeWidth = 3.dp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
