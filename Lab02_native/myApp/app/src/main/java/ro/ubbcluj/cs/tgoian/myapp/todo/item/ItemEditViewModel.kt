package ro.ubbcluj.cs.tgoian.myapp.todo.item

import android.app.Application
import android.util.Log
import androidx.lifecycle.*
import kotlinx.coroutines.launch
import ro.ubbcluj.cs.tgoian.myapp.todo.data.local.TodoDatabase
import ro.ubbcluj.cs.tgoian.myapp.core.Result
import ro.ubbcluj.cs.tgoian.myapp.core.TAG
import ro.ubbcluj.cs.tgoian.myapp.todo.data.Movie
import ro.ubbcluj.cs.tgoian.myapp.todo.data.ItemRepository

class ItemEditViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableFetching = MutableLiveData<Boolean>().apply { value = false }
    private val mutableCompleted = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val fetching: LiveData<Boolean> = mutableFetching
    val fetchingError: LiveData<Exception> = mutableException
    val completed: LiveData<Boolean> = mutableCompleted

    val itemRepository: ItemRepository

    init {
        val itemDao = TodoDatabase.getDatabase(application, viewModelScope).itemDao()
        itemRepository = ItemRepository(itemDao)
    }

    fun getItemById(itemId: String): LiveData<Movie> {
        Log.v(TAG, "getItemById...")
        return itemRepository.getById(itemId)
    }

    fun saveOrUpdateItem(movie: Movie) {
        viewModelScope.launch {
            Log.v(TAG, "saveOrUpdateItem...");
            mutableFetching.value = true
            mutableException.value = null
            val result: Result<Movie>
            if (movie._id.isNotEmpty()) {
                result = itemRepository.update(movie)
            } else {
                result = itemRepository.save(movie)
            }
            when(result) {
                is Result.Success -> {
                    Log.d(TAG, "saveOrUpdateItem succeeded");
                }
                is Result.Error -> {
                    Log.w(TAG, "saveOrUpdateItem failed", result.exception);
                    mutableException.value = result.exception
                }
            }
            mutableCompleted.value = true
            mutableFetching.value = false
        }
    }
}