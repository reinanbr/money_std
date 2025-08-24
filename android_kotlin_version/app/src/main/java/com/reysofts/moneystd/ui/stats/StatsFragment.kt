package com.reysofts.moneystd.ui.stats

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.reysofts.moneystd.MainActivity
import com.reysofts.moneystd.R
import com.reysofts.moneystd.data.repository.MoneyRepository
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.*

class StatsFragment : Fragment() {
    
    private lateinit var repository: MoneyRepository
    private lateinit var incomeValue: TextView
    private lateinit var expenseValue: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_stats, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Inicializar repository
        repository = (activity as MainActivity).getRepository()
        
        incomeValue = view.findViewById(R.id.income_value)
        expenseValue = view.findViewById(R.id.expense_value)
        
        loadStatistics()
    }
    
    override fun onResume() {
        super.onResume()
        loadStatistics()
    }
    
    private fun loadStatistics() {
        lifecycleScope.launch {
            try {
                val transactions = repository.getAllTransactions()
                
                val income = transactions.filter { it.amount > 0 }.sumOf { it.amount }
                val expense = transactions.filter { it.amount < 0 }.sumOf { kotlin.math.abs(it.amount) }
                
                val formatter = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
                
                incomeValue.text = formatter.format(income)
                expenseValue.text = formatter.format(expense)
                
            } catch (e: Exception) {
                incomeValue.text = "R$ 0,00"
                expenseValue.text = "R$ 0,00"
            }
        }
    }
}
