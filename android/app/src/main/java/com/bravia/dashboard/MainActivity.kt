package com.bravia.dashboard

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast

/**
 * Full-screen host for the web dashboard bundled in assets/dashboard/.
 * Launched from the banner tile on the TV home screen.
 */
class MainActivity : Activity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            setBackgroundColor(Color.TRANSPARENT) // show the themed window background
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            // Honour <meta name="viewport" content="width=1920"> so the layout
            // scales to the TV regardless of its screen density.
            settings.useWideViewPort = true
            settings.loadWithOverviewMode = true
            webViewClient = DashboardClient()
            addJavascriptInterface(TvBridge(), "TvBridge")
            isFocusable = true
            isFocusableInTouchMode = true
        }
        setContentView(webView)

        webView.loadUrl(DASHBOARD_URL)
        webView.requestFocus()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    /** Keeps the WebView on the bundled dashboard; anything else opens externally. */
    private inner class DashboardClient : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
            val url = request.url.toString()
            if (url.startsWith(ASSET_ROOT)) return false
            openUrl(url)
            return true
        }
    }

    /** Exposed to the page as `window.TvBridge`. */
    private inner class TvBridge {
        @JavascriptInterface
        fun launch(packageName: String, fallbackUrl: String) {
            runOnUiThread { launchApp(packageName, fallbackUrl) }
        }
    }

    private fun launchApp(packageName: String, fallbackUrl: String) {
        if (packageName.isNotEmpty()) {
            val intent = packageManager.getLeanbackLaunchIntentForPackage(packageName)
                ?: packageManager.getLaunchIntentForPackage(packageName)
            if (intent != null) {
                startActivity(intent)
                return
            }
        }
        if (fallbackUrl.isNotEmpty() && openUrl(fallbackUrl)) return
        if (packageName.isNotEmpty() && openUrl("market://details?id=$packageName")) return
        Toast.makeText(this, getString(R.string.app_not_installed, packageName), Toast.LENGTH_LONG).show()
    }

    private fun openUrl(url: String): Boolean = try {
        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
        true
    } catch (e: ActivityNotFoundException) {
        false
    }

    companion object {
        private const val ASSET_ROOT = "file:///android_asset/dashboard/"
        private const val DASHBOARD_URL = ASSET_ROOT + "index.html"
    }
}
