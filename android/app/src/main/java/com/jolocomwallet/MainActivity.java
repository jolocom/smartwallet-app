package com.jolocomwallet;

// overriden to use ReactFragmentActivity instead of ReactActivity for using
// support from react-native-screens in react-navigation
import com.facebook.react.ReactFragmentActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

// imports for react-native-gesture-handler
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactFragmentActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "jolocomwallet";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

    // override for react-native-gesture-handler
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
          return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      };
    }
}
