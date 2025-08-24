package com.reysofts.moneystd

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.textview.MaterialTextView
import com.reysofts.moneystd.data.database.MoneySTDDatabase
import com.reysofts.moneystd.data.model.Transaction
import com.reysofts.moneystd.data.repository.MoneyRepository
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.text.SimpleDateFormat
import java.util.*

class ImportJsonActivity : AppCompatActivity() {

    private lateinit var repository: MoneyRepository
    private lateinit var btnSelectFile: MaterialButton
    private lateinit var btnImport: MaterialButton
    private lateinit var btnCancel: MaterialButton
    private lateinit var txtFileName: MaterialTextView
    private lateinit var txtPreview: MaterialTextView
    
    private var selectedFileUri: Uri? = null
    private var jsonData: JSONArray? = null
    
    companion object {
        private const val PICK_JSON_FILE = 1001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_import_json)

        // Inicializar repository
        val database = MoneySTDDatabase.getDatabase(this)
        repository = MoneyRepository(database.transactionDao(), database.categoryDao())

        initViews()
        setupButtons()
    }

    private fun initViews() {
        btnSelectFile = findViewById(R.id.btn_select_file)
        btnImport = findViewById(R.id.btn_import)
        btnCancel = findViewById(R.id.btn_cancel)
        txtFileName = findViewById(R.id.txt_file_name)
        txtPreview = findViewById(R.id.txt_preview)
        
        btnImport.isEnabled = false
    }

    private fun setupButtons() {
        btnSelectFile.setOnClickListener {
            openFilePicker()
        }

        btnImport.setOnClickListener {
            importJsonData()
        }

        btnCancel.setOnClickListener {
            finish()
        }
    }

    private fun openFilePicker() {
        val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
            type = "application/json"
            addCategory(Intent.CATEGORY_OPENABLE)
        }
        startActivityForResult(intent, PICK_JSON_FILE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        if (requestCode == PICK_JSON_FILE && resultCode == Activity.RESULT_OK) {
            data?.data?.let { uri ->
                selectedFileUri = uri
                readJsonFile(uri)
            }
        }
    }

    private fun readJsonFile(uri: Uri) {
        try {
            contentResolver.openInputStream(uri)?.use { inputStream ->
                val reader = BufferedReader(InputStreamReader(inputStream))
                val jsonString = reader.readText()
                
                jsonData = JSONArray(jsonString)
                
                txtFileName.text = "Arquivo selecionado: ${getFileName(uri)}"
                txtPreview.text = "Encontradas ${jsonData?.length()} transações\n\nPreview:\n${getPreviewText()}"
                
                btnImport.isEnabled = true
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Erro ao ler arquivo JSON: ${e.message}", Toast.LENGTH_LONG).show()
            txtFileName.text = "Erro ao ler arquivo"
            txtPreview.text = ""
            btnImport.isEnabled = false
        }
    }

    private fun getFileName(uri: Uri): String {
        var result = "arquivo.json"
        contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            if (cursor.moveToFirst()) {
                val displayNameIndex = cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME)
                if (displayNameIndex >= 0) {
                    result = cursor.getString(displayNameIndex)
                }
            }
        }
        return result
    }

    private fun getPreviewText(): String {
        val preview = StringBuilder()
        jsonData?.let { array ->
            val itemsToShow = minOf(3, array.length())
            for (i in 0 until itemsToShow) {
                val item = array.getJSONObject(i)
                preview.append("${i + 1}. ${item.optString("description", "Sem descrição")}")
                preview.append(" - R$ ${item.optDouble("amount", 0.0)}")
                preview.append("\n")
            }
            if (array.length() > 3) {
                preview.append("... e mais ${array.length() - 3} transações")
            }
        }
        return preview.toString()
    }

    private fun importJsonData() {
        lifecycleScope.launch {
            try {
                var importedCount = 0
                var errorCount = 0
                
                jsonData?.let { array ->
                    // Garantir que categorias padrão existam
                    repository.initializeDefaultCategories()
                    val categories = repository.getAllCategories()
                    val defaultCategory = categories.firstOrNull() ?: return@let
                    
                    for (i in 0 until array.length()) {
                        try {
                            val item = array.getJSONObject(i)
                            
                            val description = item.optString("description", "Transação importada")
                            val amount = item.optDouble("amount", 0.0)
                            val categoryName = item.optString("category", "")
                            val date = item.optLong("date", System.currentTimeMillis())
                            
                            // Buscar categoria ou usar padrão
                            val category = categories.find { it.name.equals(categoryName, true) } ?: defaultCategory
                            
                            val transaction = Transaction(
                                description = description,
                                amount = amount,
                                categoryId = category.id,
                                type = if (amount < 0) com.reysofts.moneystd.data.model.TransactionType.EXPENSE else com.reysofts.moneystd.data.model.TransactionType.INCOME,
                                date = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date(date))
                            )
                            
                            repository.insertTransaction(transaction)
                            importedCount++
                            
                        } catch (e: Exception) {
                            errorCount++
                        }
                    }
                }
                
                val message = if (errorCount == 0) {
                    "Importação concluída! $importedCount transações importadas."
                } else {
                    "Importação concluída! $importedCount transações importadas, $errorCount com erro."
                }
                
                Toast.makeText(this@ImportJsonActivity, message, Toast.LENGTH_LONG).show()
                finish()
                
            } catch (e: Exception) {
                Toast.makeText(this@ImportJsonActivity, "Erro na importação: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }
}
