package com.nsguruji.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nsguruji.app.data.model.ArticleUiModel
import com.nsguruji.app.data.repository.NewsRepository
import com.nsguruji.app.data.repository.NewsRepositoryImpl
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class SearchUiState(
    val query: String = "",
    val results: List<ArticleUiModel> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val hasSearched: Boolean = false
)

class SearchViewModel(
    private val repository: NewsRepository = NewsRepositoryImpl.instance
) : ViewModel() {

    private val _uiState = MutableStateFlow(SearchUiState())
    val uiState: StateFlow<SearchUiState> = _uiState.asStateFlow()

    private var searchJob: Job? = null

    fun onQueryChange(newQuery: String) {
        _uiState.update { it.copy(query = newQuery) }

        searchJob?.cancel()

        if (newQuery.isBlank()) {
            _uiState.update {
                it.copy(
                    results = emptyList(),
                    isLoading = false,
                    hasSearched = false,
                    errorMessage = null
                )
            }
            return
        }

        searchJob = viewModelScope.launch {
            // Debounce user typing by 400ms
            delay(400)
            performSearch(newQuery.trim())
        }
    }

    fun performSearch(queryToSearch: String = _uiState.value.query.trim()) {
        if (queryToSearch.isBlank()) return

        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isLoading = true,
                    errorMessage = null,
                    hasSearched = true
                )
            }

            val result = repository.searchPosts(query = queryToSearch, page = 1, perPage = 30)
            result.onSuccess { articles ->
                _uiState.update {
                    it.copy(
                        results = articles,
                        isLoading = false,
                        errorMessage = null
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = error.localizedMessage ?: "खोज परिणाम प्राप्त नहीं हो सके"
                    )
                }
            }
        }
    }

    fun clearSearch() {
        searchJob?.cancel()
        _uiState.update {
            SearchUiState()
        }
    }
}
