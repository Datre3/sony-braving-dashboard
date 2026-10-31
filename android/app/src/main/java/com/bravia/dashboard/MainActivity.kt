package com.bravia.dashboard

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream

/**
 * Full-screen host for the web dashboard bundled in assets/dashboard/.
 * Launched from its banner tile, or used as the TV's home screen (launcher)
 * once the stock launcher is disabled.
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
            webViewClient = DashboardClient()
            addJavascriptInterface(TvBridge(), "TvBridge")
            isFocusable = true
            isFocusableInTouchMode = true
        }
        setContentView(webView)

        webView.loadUrl(DASHBOARD_URL)
        webView.requestFocus()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        // Home pressed while we're already showing: return to the main dashboard.
        if (intent.hasCategory(Intent.CATEGORY_HOME)) {
            webView.evaluateJavascript("window.goHome && window.goHome()", null)
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Let the page close the All apps screen first. As the home screen,
        // Back has nowhere to go, so it stops here.
        webView.evaluateJavascript("window.handleBack ? window.handleBack() : false") { handled ->
            if (handled != "true" && !isHome()) finish()
        }
    }

    private fun isHome() = intent?.hasCategory(Intent.CATEGORY_HOME) == true

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

        @JavascriptInterface
        fun openSettings() {
            runOnUiThread {
                try {
                    startActivity(Intent(Settings.ACTION_SETTINGS))
                } catch (e: ActivityNotFoundException) {
                    Toast.makeText(this@MainActivity, R.string.settings_unavailable, Toast.LENGTH_LONG).show()
                }
            }
        }

        @JavascriptInterface
        fun version(): String = packageManager.getPackageInfo(packageName, 0).versionName ?: ""

        /** Installed TV apps as JSON: [{name, package, banner?, icon?}], banners/icons as data URIs. */
        @JavascriptInterface
        fun listApps(): String = installedApps().toString()
    }

    private fun installedApps(): JSONArray {
        val pm = packageManager
        val query = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LEANBACK_LAUNCHER)
        val apps = pm.queryIntentActivities(query, 0)
            .filter { it.activityInfo.packageName != packageName }
            .distinctBy { it.activityInfo.packageName }
            .sortedBy { it.loadLabel(pm).toString().lowercase() }

        val out = JSONArray()
        for (app in apps) {
            val info = app.activityInfo
            val banner = info.loadBanner(pm) ?: info.applicationInfo.loadBanner(pm)
            out.put(JSONObject().apply {
                put("name", app.loadLabel(pm).toString())
                put("package", info.packageName)
                if (banner != null) {
                    put("banner", toDataUri(banner, 320, 180))
                } else {
                    put("icon", toDataUri(app.loadIcon(pm), 128, 128))
                }
            })
        }
        return out
    }

    private fun toDataUri(drawable: Drawable, width: Int, height: Int): String {
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        drawable.setBounds(0, 0, width, height)
        drawable.draw(Canvas(bitmap))
        val png = ByteArrayOutputStream().also {
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
        }.toByteArray()
        bitmap.recycle()
        return "data:image/png;base64," + Base64.encodeToString(png, Base64.NO_WRAP)
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
