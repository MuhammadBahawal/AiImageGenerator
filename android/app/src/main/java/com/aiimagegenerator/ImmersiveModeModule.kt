package com.aiimagegenerator

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import kotlin.math.roundToLong

class ImmersiveModeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ImmersiveMode"

  @ReactMethod
  fun enableImmersive() {
    runOnMainActivity { activity ->
      activity.enableImmersiveMode()
    }
  }

  @ReactMethod
  fun disableImmersive() {
    runOnMainActivity { activity ->
      activity.disableImmersiveMode()
    }
  }

  @ReactMethod
  fun scheduleImmersiveReapply(delayMs: Double) {
    val safeDelayMs = delayMs.roundToLong().coerceAtLeast(0L)
    runOnMainActivity { activity ->
      activity.scheduleImmersiveReapply(safeDelayMs)
    }
  }

  private fun runOnMainActivity(action: (MainActivity) -> Unit) {
    UiThreadUtil.runOnUiThread {
      val activity =
        (reactApplicationContext.currentActivity as? MainActivity) ?: MainActivity.getCurrentActivity()
      activity?.let(action)
    }
  }
}
