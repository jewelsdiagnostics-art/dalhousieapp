package com.dalhousie.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.dalhousie.app.ui.DalhousieApp
import com.dalhousie.app.ui.theme.DalhousieTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DalhousieTheme {
                DalhousieApp()
            }
        }
    }
}
