package com.aiimagegenerator

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import java.lang.ref.WeakReference

class MainActivity : ReactActivity() {

  companion object {
    private var currentActivityRef: WeakReference<MainActivity>? = null
    private const val DEFAULT_REAPPLY_DELAY_MS = 2500L

    @JvmStatic
    fun getCurrentActivity(): MainActivity? = currentActivityRef?.get()
  }

  private val immersiveHandler = Handler(Looper.getMainLooper())
  private var immersiveEnabled = true
  private val immersiveReapplyRunnable = Runnable {
    if (immersiveEnabled) {
      applyImmersiveMode()
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    currentActivityRef = WeakReference(this)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    setupInsetsListener()
    enableImmersiveMode()
  }

  override fun onResume() {
    super.onResume()
    currentActivityRef = WeakReference(this)
    if (immersiveEnabled) {
      enableImmersiveMode()
    }
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus && immersiveEnabled) {
      enableImmersiveMode()
    }
  }

  override fun onDestroy() {
    immersiveHandler.removeCallbacks(immersiveReapplyRunnable)
    if (currentActivityRef?.get() === this) {
      currentActivityRef = null
    }
    super.onDestroy()
  }

  fun enableImmersiveMode(delayMs: Long = DEFAULT_REAPPLY_DELAY_MS) {
    immersiveEnabled = true
    applyImmersiveMode()
    scheduleImmersiveReapply(delayMs)
  }

  fun disableImmersiveMode() {
    immersiveEnabled = false
    immersiveHandler.removeCallbacks(immersiveReapplyRunnable)
    WindowCompat.getInsetsController(window, window.decorView)
      ?.show(WindowInsetsCompat.Type.systemBars())
  }

  fun scheduleImmersiveReapply(delayMs: Long = DEFAULT_REAPPLY_DELAY_MS) {
    if (!immersiveEnabled) {
      return
    }
    immersiveHandler.removeCallbacks(immersiveReapplyRunnable)
    immersiveHandler.postDelayed(immersiveReapplyRunnable, delayMs.coerceAtLeast(0L))
  }

  private fun applyImmersiveMode() {
    WindowCompat.setDecorFitsSystemWindows(window, false)
    val insetsController = WindowCompat.getInsetsController(window, window.decorView) ?: return
    insetsController.systemBarsBehavior =
      WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    insetsController.hide(WindowInsetsCompat.Type.systemBars())
  }

  private fun setupInsetsListener() {
    ViewCompat.setOnApplyWindowInsetsListener(window.decorView) { _, insets ->
      if (immersiveEnabled && insets.isVisible(WindowInsetsCompat.Type.navigationBars())) {
        scheduleImmersiveReapply()
      }
      insets
    }
    ViewCompat.requestApplyInsets(window.decorView)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "AIImageGenerator"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
