package com.reysofts.moneystd.data.database

import androidx.room.*
import com.reysofts.moneystd.data.model.Transaction
import com.reysofts.moneystd.data.model.Category
import com.reysofts.moneystd.data.model.TransactionType

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions ORDER BY date DESC")
    suspend fun getAllTransactions(): List<Transaction>
    
    @Query("SELECT * FROM transactions WHERE type = :type ORDER BY date DESC")
    suspend fun getTransactionsByType(type: TransactionType): List<Transaction>
    
    @Insert
    suspend fun insertTransaction(transaction: Transaction): Long
    
    @Update
    suspend fun updateTransaction(transaction: Transaction)
    
    @Delete
    suspend fun deleteTransaction(transaction: Transaction)
    
    @Query("SELECT SUM(amount) FROM transactions WHERE type = 'INCOME'")
    suspend fun getTotalIncome(): Double?
    
    @Query("SELECT SUM(amount) FROM transactions WHERE type = 'EXPENSE'")
    suspend fun getTotalExpense(): Double?
}

@Dao
interface CategoryDao {
    @Query("SELECT * FROM categories ORDER BY name")
    suspend fun getAllCategories(): List<Category>
    
    @Query("SELECT * FROM categories WHERE type = :type ORDER BY name")
    suspend fun getCategoriesByType(type: TransactionType): List<Category>
    
    @Insert
    suspend fun insertCategory(category: Category): Long
    
    @Update
    suspend fun updateCategory(category: Category)
    
    @Delete
    suspend fun deleteCategory(category: Category)
}

@Database(
    entities = [Transaction::class, Category::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class MoneySTDDatabase : RoomDatabase() {
    abstract fun transactionDao(): TransactionDao
    abstract fun categoryDao(): CategoryDao
    
    companion object {
        @Volatile
        private var INSTANCE: MoneySTDDatabase? = null
        
        fun getDatabase(context: android.content.Context): MoneySTDDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    MoneySTDDatabase::class.java,
                    "money_std_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}

class Converters {
    @TypeConverter
    fun fromTransactionType(type: TransactionType): String {
        return type.name
    }
    
    @TypeConverter
    fun toTransactionType(type: String): TransactionType {
        return TransactionType.valueOf(type)
    }
}
