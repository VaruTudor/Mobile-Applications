package ro.ubbcluj.cs.tgoian.myapp.todo.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "movies")
data class Movie(
    @PrimaryKey @ColumnInfo(name = "_id") val _id: String,
    @ColumnInfo(name = "title") var title: String,
    @ColumnInfo(name = "producer") var producer: String?,
    @ColumnInfo(name = "description") var description: String?
) {
    override fun toString(): String = "$title| descr:$description"
}