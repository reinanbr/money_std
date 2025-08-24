package com.reysofts.moneystd.data.repository

import com.reysofts.moneystd.data.database.TransactionDao
import com.reysofts.moneystd.data.database.CategoryDao
import com.reysofts.moneystd.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class MoneyRepository(
    private val transactionDao: TransactionDao,
    private val categoryDao: CategoryDao
) {
    
    suspend fun getAllTransactions(): List<Transaction> {
        return transactionDao.getAllTransactions()
    }
    
    suspend fun getTransactionsByType(type: TransactionType): List<Transaction> {
        return transactionDao.getTransactionsByType(type)
    }
    
    suspend fun insertTransaction(transaction: Transaction): Long {
        return transactionDao.insertTransaction(transaction)
    }
    
    suspend fun updateTransaction(transaction: Transaction) {
        transactionDao.updateTransaction(transaction)
    }
    
    suspend fun deleteTransaction(transaction: Transaction) {
        transactionDao.deleteTransaction(transaction)
    }
    
    suspend fun getBalance(): Balance {
        val income = transactionDao.getTotalIncome() ?: 0.0
        val expense = transactionDao.getTotalExpense() ?: 0.0
        val total = income - expense
        return Balance(total, income, expense)
    }
    
    suspend fun getAllCategories(): List<Category> {
        return categoryDao.getAllCategories()
    }
    
    suspend fun getCategoriesByType(type: TransactionType): List<Category> {
        return categoryDao.getCategoriesByType(type)
    }
    
    suspend fun insertCategory(category: Category): Long {
        return categoryDao.insertCategory(category)
    }
    
    suspend fun initializeDefaultCategories() {
        val existingCategories = getAllCategories()
        if (existingCategories.isEmpty()) {
            val defaultCategories = listOf(
                Category(name = "Alimentação", type = TransactionType.EXPENSE, color = "#FF6B6B"),
                Category(name = "Transporte", type = TransactionType.EXPENSE, color = "#4ECDC4"),
                Category(name = "Moradia", type = TransactionType.EXPENSE, color = "#45B7D1"),
                Category(name = "Saúde", type = TransactionType.EXPENSE, color = "#96CEB4"),
                Category(name = "Educação", type = TransactionType.EXPENSE, color = "#FFEAA7"),
                Category(name = "Lazer", type = TransactionType.EXPENSE, color = "#DDA0DD"),
                Category(name = "Salário", type = TransactionType.INCOME, color = "#2ECC71"),
                Category(name = "Freelance", type = TransactionType.INCOME, color = "#F39C12"),
                Category(name = "Investimentos", type = TransactionType.INCOME, color = "#9B59B6"),
                Category(name = "Outros", type = TransactionType.EXPENSE, color = "#95A5A6")
            )
            
            defaultCategories.forEach { category ->
                insertCategory(category)
            }
        }
    }
}
