package com.reysofts.moneystd.ui.transactions

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.google.android.material.button.MaterialButton
import com.reysofts.moneystd.AddTransactionActivity
import com.reysofts.moneystd.R

class TransactionsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val btnAddTransaction = view.findViewById<MaterialButton>(R.id.btn_add_transaction)
        btnAddTransaction.setOnClickListener {
            val intent = Intent(context, AddTransactionActivity::class.java)
            startActivity(intent)
        }
    }
}
