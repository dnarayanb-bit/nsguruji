package com.nsguruji.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nsguruji.app.data.model.ArticleUiModel
import com.nsguruji.app.data.model.Category
import com.nsguruji.app.data.repository.NewsRepository
import com.nsguruji.app.data.repository.NewsRepositoryImpl
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class HomeUiState(
    val posts: List<ArticleUiModel> = emptyList(),
    val categories: List<Category> = emptyList(),
    val selectedCategoryId: Long? = null,
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val isLoadingMore: Boolean = false,
    val errorMessage: String? = null,
    val isEndOfPagination: Boolean = false,
    val currentPage: Int = 1
)

class HomeViewModel(
    private val repository: NewsRepository = NewsRepositoryImpl.instance
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadInitialData()
    }

    fun loadInitialData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            // Fetch categories in parallel
            launch {
                val catResult = repository.getCategories()
                catResult.onSuccess { cats ->
                    _uiState.update { it.copy(categories = cats) }
                }
            }

            // Fetch first page of articles
            val postsResult = repository.getPosts(page = 1, perPage = 20, categoryId = _uiState.value.selectedCategoryId)
            postsResult.onSuccess { articles ->
                _uiState.update {
                    it.copy(
                        posts = articles,
                        isLoading = false,
                        currentPage = 1,
                        isEndOfPagination = articles.size < 20,
                        errorMessage = null
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = formatErrorMessage(error)
                    )
                }
            }
        }
    }

    fun selectCategory(categoryId: Long?) {
        if (_uiState.value.selectedCategoryId == categoryId && !_uiState.value.isLoading) {
            return
        }

        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    selectedCategoryId = categoryId,
                    isLoading = true,
                    currentPage = 1,
                    posts = emptyList(),
                    errorMessage = null,
                    isEndOfPagination = false
                )
            }

            val result = repository.getPosts(page = 1, perPage = 20, categoryId = categoryId)
            result.onSuccess { articles ->
                _uiState.update {
                    it.copy(
                        posts = articles,
                        isLoading = false,
                        currentPage = 1,
                        isEndOfPagination = articles.size < 20,
                        errorMessage = null
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = formatErrorMessage(error)
                    )
                }
            }
        }
    }

    private fun formatErrorMessage(error: Throwable): String {
        val msg = error.localizedMessage ?: ""
        return when {
            msg.contains("403", ignoreCase = true) -> "सर्वर से संपर्क करने में समस्या आई। पुनः प्रयास करें।"
            msg.contains("Unable to resolve host", ignoreCase = true) || msg.contains("timeout", ignoreCase = true) -> "इंटरनेट कनेक्शन उपलब्ध नहीं है। कृपया अपना नेटवर्क जांचें।"
            else -> msg.ifBlank { "डेटा लोड करने में समस्या आई। पुनः प्रयास करें।" }
        }
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true, errorMessage = null) }

            // Refresh categories & first page
            repository.getCategories().onSuccess { cats ->
                _uiState.update { it.copy(categories = cats) }
            }

            val result = repository.getPosts(
                page = 1,
                perPage = 20,
                categoryId = _uiState.value.selectedCategoryId
            )

            result.onSuccess { articles ->
                _uiState.update {
                    it.copy(
                        posts = articles,
                        isRefreshing = false,
                        currentPage = 1,
                        isEndOfPagination = articles.size < 20,
                        errorMessage = null
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isRefreshing = false,
                        errorMessage = if (it.posts.isEmpty()) formatErrorMessage(error) else null
                    )
                }
            }
        }
    }

    fun loadNextPage() {
        val currentState = _uiState.value
        if (currentState.isLoading || currentState.isLoadingMore || currentState.isRefreshing || currentState.isEndOfPagination) {
            return
        }

        viewModelScope.launch {
            val nextPage = currentState.currentPage + 1
            _uiState.update { it.copy(isLoadingMore = true) }

            val result = repository.getPosts(
                page = nextPage,
                perPage = 20,
                categoryId = currentState.selectedCategoryId
            )

            result.onSuccess { newArticles ->
                _uiState.update {
                    it.copy(
                        posts = it.posts + newArticles,
                        currentPage = nextPage,
                        isLoadingMore = false,
                        isEndOfPagination = newArticles.size < 20
                    )
                }
            }.onFailure {
                _uiState.update { it.copy(isLoadingMore = false) }
            }
        }
    }

    fun retry() {
        loadInitialData()
    }
}
