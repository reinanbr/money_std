package com.reysofts.moneystd

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.navigation.findNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.reysofts.moneystd.data.database.MoneySTDDatabase
import com.reysofts.moneystd.data.repository.MoneyRepository
import com.reysofts.moneystd.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var repository: MoneyRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializar banco de dados e repository
        val database = MoneySTDDatabase.getDatabase(this)
        repository = MoneyRepository(database.transactionDao(), database.categoryDao())
        
        // Inicializar categorias padrão
        lifecycleScope.launch {
            repository.initializeDefaultCategories()
        }

        val navView: BottomNavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_activity_main)
        
        // Configurar navegação apenas com a bottom nav
        navView.setupWithNavController(navController)
    }
    
    fun getRepository(): MoneyRepository {
        return repository
    }
}
