package com.gittermobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.oblador.vectoricons.VectorIconsPackage;
import com.terrysahaidak.faye.FayeGitterPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.terrysahaidak.bottomsheet.AndroidBottomSheetPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import cl.json.RNSharePackage;
import com.reactnativenavigation.NavigationApplication;

// public class MainApplication extends Application implements ReactApplication {
  //
  // private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
  //   @Override
  //   public boolean getUseDeveloperSupport() {
  //     return BuildConfig.DEBUG;
  //   }
  //
  //   @Override
  //   protected List<ReactPackage> getPackages() {
  //     return Arrays.<ReactPackage>asList(
  //         new MainReactPackage(),
  //         new RNSharePackage(),
  //         new VectorIconsPackage(),
  //         new ReactNativeDialogsPackage(),
  //         new FayeGitterPackage(),
  //         new RNDeviceInfo(),
  //         new AndroidBottomSheetPackage()
  //     );
  //   }
  // };
  //
  // @Override
  // public ReactNativeHost getReactNativeHost() {
  //   return mReactNativeHost;
  // }
public class MainApplication extends NavigationApplication {
  @Override
  public boolean isDebug() {
     // Make sure you are using BuildConfig from your own application
     return BuildConfig.DEBUG;
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return Arrays.<ReactPackage>asList(
      new RNSharePackage(),
      new VectorIconsPackage(),
      new ReactNativeDialogsPackage(),
      new FayeGitterPackage(),
      new RNDeviceInfo(),
      new RNFetchBlobPackage(),
      new AndroidBottomSheetPackage()
    );
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
