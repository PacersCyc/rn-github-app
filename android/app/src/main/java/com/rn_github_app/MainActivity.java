package com.rn_github_app;

import android.content.Intent;
import android.os.Bundle;

import com.example.trackshare.ShareModule;
import com.facebook.react.ReactActivity;

import com.umeng.analytics.MobclickAgent;
import com.umeng.socialize.UMShareAPI;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "rn_github_app";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
    //以及发送间隔
    MobclickAgent.setSessionContinueMillis(1000);
    //统计的场景
    MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_UM_NORMAL);
    ShareModule.initSocialSDK(this);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
  }

  public void onResume() {
    super.onResume();
    MobclickAgent.onResume(this);
  }
  public void onPause() {
    super.onPause();
    MobclickAgent.onPause(this);
  }
}
