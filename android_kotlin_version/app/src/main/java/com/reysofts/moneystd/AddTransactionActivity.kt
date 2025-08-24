package com.reysofts.moneystd

import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.MaterialAutoCompleteTextView
import com.google.android.material.textfield.TextInputEditText
import com.reysofts.moneystd.data.database.MoneySTDDatabase
import com.reysofts.moneystd.data.model.Transaction
import com.reysofts.moneystd.data.repository.MoneyRepository
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class AddTransactionActivity : AppCompatActivity() {

    private lateinit var repository: MoneyRepository
    private lateinit var editDescription: TextInputEditText
    private lateinit var editAmount: TextInputEditText
    private lateinit var spinnerCategory: MaterialAutoCompleteTextView
    private lateinit var spinnerType: MaterialAutoCompleteTextView
    private lateinit var editDate: TextInputEditText
    private lateinit var btnSave: MaterialButton
    private lateinit var btnCancel: MaterialButton
    
    private var selectedDate = Calendar.getInstance()
    private val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_transaction)

        // Inicializar repository
        val database = MoneySTDDatabase.getDatabase(this)
        repository = MoneyRepository(database.transactionDao(), database.categoryDao())

        initViews()
        setupSpinners()
        setupDatePicker()
        setupButtons()
    }

    private fun initViews() {
        editDescription = findViewById(R.id.edit_description)
        editAmount = findViewById(R.id.edit_amount)
        spinnerCategory = findViewById(R.id.spinner_category)
        spinnerType = findViewById(R.id.spinner_type)
        editDate = findViewById(R.id.edit_date)
        btnSave = findViewById(R.id.btn_save)
        btnCancel = findViewById(R.id.btn_cancel)
        
        // Definir data atual
        editDate.setText(dateFormat.format(selectedDate.time))
    }

    private fun setupSpinners() {
        // Tipos de transação
        val types = arrayOf("Receita", "Despesa")
        val typeAdapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, types)
        spinnerType.setAdapter(typeAdapter)

        // Categorias (será carregado do banco)
        lifecycleScope.launch {
            val categories = repository.getAllCategories()
            val categoryNames = categories.map { it.name }.toTypedArray()
            val categoryAdapter = ArrayAdapter(this@AddTransactionActivity, android.R.layout.simple_dropdown_item_1line, categoryNames)
            spinnerCategory.setAdapter(categoryAdapter)
        }
    }

    private fun setupDatePicker() {
        editDate.setOnClickListener {
            DatePickerDialog(
                this,
                { _, year, month, dayOfMonth ->
                    selectedDate.set(year, month, dayOfMonth)
                    editDate.setText(dateFormat.format(selectedDate.time))
                },
                selectedDate.get(Calendar.YEAR),
                selectedDate.get(Calendar.MONTH),
                selectedDate.get(Calendar.DAY_OF_MONTH)
            ).show()
        }
    }

    private fun setupButtons() {
        btnSave.setOnClickListener {
            saveTransaction()
        }

        btnCancel.setOnClickListener {
            finish()
        }
    }

    private fun saveTransaction() {
        val description = editDescription.text.toString().trim()
        val amountText = editAmount.text.toString().trim()
        val category = spinnerCategory.text.toString().trim()
        val type = spinnerType.text.toString().trim()

        if (description.isEmpty() || amountText.isEmpty() || category.isEmpty() || type.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
            return
        }

        val amount = try {
            amountText.toDouble()
        } catch (e: NumberFormatException) {
            Toast.makeText(this, "Valor inválido", Toast.LENGTH_SHORT).show()
            return
        }

        val finalAmount = if (type == "Despesa") -amount else amount

        lifecycleScope.launch {
            try {
                val categories = repository.getAllCategories()
                val selectedCategory = categories.find { it.name == category }
                
                if (selectedCategory != null) {
                    val transaction = Transaction(
                        description = description,
                        amount = finalAmount,
                        categoryId = selectedCategory.id,
                        type = if (type == "Despesa") com.reysofts.moneystd.data.model.TransactionType.EXPENSE else com.reysofts.moneystd.data.model.TransactionType.INCOME,
                        date = dateFormat.format(selectedDate.time)
                    )
                    
                    repository.insertTransaction(transaction)
                    
                    Toast.makeText(this@AddTransactionActivity, "Transação salva com sucesso!", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@AddTransactionActivity, "Categoria não encontrada", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@AddTransactionActivity, "Erro ao salvar transação", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
