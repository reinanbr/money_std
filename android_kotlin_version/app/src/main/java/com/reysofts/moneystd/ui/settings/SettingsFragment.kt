package com.reysofts.moneystd.ui.settings

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.google.android.material.button.MaterialButton
import com.reysofts.moneystd.ImportJsonActivity
import com.reysofts.moneystd.R

class SettingsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_settings, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val btnExportData = view.findViewById<MaterialButton>(R.id.btn_export_data)
        val btnClearData = view.findViewById<MaterialButton>(R.id.btn_clear_data)
        val btnImportJson = view.findViewById<MaterialButton>(R.id.btn_import_json)
        
        btnExportData.setOnClickListener {
            Toast.makeText(context, "Função de exportar em desenvolvimento", Toast.LENGTH_SHORT).show()
        }
        
        btnClearData.setOnClickListener {
            Toast.makeText(context, "Função de limpar dados em desenvolvimento", Toast.LENGTH_SHORT).show()
        }
        
        btnImportJson.setOnClickListener {
            val intent = Intent(context, ImportJsonActivity::class.java)
            startActivity(intent)
        }
    }
}
