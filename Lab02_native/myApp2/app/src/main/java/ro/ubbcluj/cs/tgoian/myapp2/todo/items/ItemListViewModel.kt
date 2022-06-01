package ro.ubbcluj.cs.tgoian.myapp2.todo.items

import android.app.Application
import android.util.Log
import androidx.lifecycle.*
import kotlinx.coroutines.launch
import ro.ubbcluj.cs.tgoian.myapp2.todo.data.local.TodoDatabase
import ro.ubbcluj.cs.tgoian.myapp2.core.Result
import ro.ubbcluj.cs.tgoian.myapp2.core.TAG
import ro.ubbcluj.cs.tgoian.myapp2.todo.data.Movie
import ro.ubbcluj.cs.tgoian.myapp2.todo.data.ItemRepository

class ItemListViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableLoading = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val items: LiveData<List<Movie>>
    val loading: LiveData<Boolean> = mutableLoading
    val loadingError: LiveData<Exception> = mutableException

    val itemRepository: ItemRepository

    init {
        val itemDao = TodoDatabase.getDatabase(application, viewModelScope).itemDao()
        itemRepository = ItemRepository(itemDao)
        items = itemRepository.items
    }

    fun refresh() {
        viewModelScope.launch {
            Log.v(TAG, "refresh...");
            mutableLoading.value = true
            mutableException.value = null
            when (val result = itemRepository.refresh()) {
                is Result.Success -> {
                    Log.d(TAG, "refresh succeeded");
                }
                is Result.Error -> {
                    Log.w(TAG, "refresh failed", result.exception);
                    mutableException.value = result.exception
                }
            }
            mutableLoading.value = false
        }
    }
}
