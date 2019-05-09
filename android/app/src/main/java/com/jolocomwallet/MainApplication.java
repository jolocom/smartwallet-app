package com.jolocomwallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.keychain.KeychainPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.keychain.KeychainPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;
import com.facebook.react.devsupport.DevInternalSettings;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNLanguagesPackage(),
            new RandomBytesPackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new SvgPackage(),
            new KeychainPackage(),
            new RNFetchBlobPackage(),
            new RNCameraPackage(),
            new SQLitePluginPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    DevInternalSettings settings = (DevInternalSettings) getReactNativeHost().getReactInstanceManager().getDevSupportManager().getDevSettings();
        if (settings != null) {
            settings.setBundleDeltasEnabled(false);
        } 
    SoLoader.init(this, /* native exopackage */ false);
  }
}
