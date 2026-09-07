package com.nsguruji.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nsguruji.app.data.model.ArticleUiModel
import com.nsguruji.app.data.repository.NewsRepository
import com.nsguruji.app.data.repository.NewsRepositoryImpl
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ArticleDetailUiState(
    val article: ArticleUiModel? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class ArticleDetailViewModel(
    private val repository: NewsRepository = NewsRepositoryImpl.instance
) : ViewModel() {

    private val _uiState = MutableStateFlow(ArticleDetailUiState())
    val uiState: StateFlow<ArticleDetailUiState> = _uiState.asStateFlow()

    fun loadArticle(articleId: Long) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val result = repository.getPostById(articleId)
            result.onSuccess { article ->
                _uiState.update {
                    it.copy(
                        article = article,
                        isLoading = false,
                        errorMessage = null
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = error.localizedMessage ?: "खबर लोड नहीं हो सकी"
                    )
                }
            }
        }
    }
}
