package ro.ubbcluj.cs.tgoian.myapp.todo.data

import androidx.lifecycle.LiveData
import ro.ubbcluj.cs.tgoian.myapp.todo.data.local.ItemDao
import ro.ubbcluj.cs.tgoian.myapp.core.Result
import ro.ubbcluj.cs.tgoian.myapp.todo.data.remote.ItemApi

class ItemRepository(private val itemDao: ItemDao) {

    val items = itemDao.getAll()

    suspend fun refresh(): Result<Boolean> {
        try {
            val items = ItemApi.service.find()
            for (item in items) {
                itemDao.insert(item)
            }
            return Result.Success(true)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

    fun getById(itemId: String): LiveData<Movie> {
        return itemDao.getById(itemId)
    }

    suspend fun save(movie: Movie): Result<Movie> {
        try {
            val createdItem = ItemApi.service.create(movie)
            itemDao.insert(createdItem)
            return Result.Success(createdItem)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun update(movie: Movie): Result<Movie> {
        try {
            val updatedItem = ItemApi.service.update(movie._id, movie)
            itemDao.update(updatedItem)
            return Result.Success(updatedItem)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }
}