package com.reysofts.moneystd.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val amount: Double,
    val description: String,
    val categoryId: Long,
    val type: TransactionType,
    val date: String,
    val categoryName: String? = null,
    val categoryColor: String? = null
)

enum class TransactionType {
    INCOME, EXPENSE
}

@Entity(tableName = "categories")
data class Category(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val type: TransactionType,
    val color: String
)

data class Balance(
    val total: Double,
    val income: Double,
    val expense: Double
)
