package com.terrysahaidak.faye;

import com.google.gson.JsonObject;
import javax.annotation.Nullable;

import com.amatkivskiy.gitter.sdk.async.faye.client.AsyncGitterFayeClient;
import com.amatkivskiy.gitter.sdk.async.faye.interfaces.ChannelListener;
import com.amatkivskiy.gitter.sdk.async.faye.interfaces.ConnectionListener;
import com.amatkivskiy.gitter.sdk.async.faye.interfaces.DisconnectionListener;
import com.amatkivskiy.gitter.sdk.async.faye.interfaces.Logger;
import com.amatkivskiy.gitter.sdk.async.faye.interfaces.DisconnectionListener;
import com.amatkivskiy.gitter.sdk.async.faye.interfaces.FailListener;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class FayeGitterModule extends ReactContextBaseJavaModule {
    private static String accessToken;
    private static AsyncGitterFayeClient client;
    private static Boolean connectStatus = false;

    public FayeGitterModule(ReactApplicationContext reactContext) {
      super(reactContext);
    }

    @Override
    public String getName() {
      return "FayeGitter";
    }

    private String getAccessToken() {
      return accessToken;
    }

    private void sendEvent(String eventName, @Nullable Object params) {
      getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
    }

    private void sendEvent(String eventName, String message) {
      getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, message);
    }

    @ReactMethod
    public void setAccessToken(String token) {
      accessToken = token;
    }

    @ReactMethod
    public void create() {
      this.client = new AsyncGitterFayeClient(
        getAccessToken(),
        new DisconnectionListener() {
          @Override
          public void onDisconnected() {
            sendEvent("FayeGitter:onDisconnected", "Disconected");
            connectStatus = false;
          }
        },
        new FailListener() {
          @Override
          public void onFailed(Exception ex) {
            sendEvent("FayeGitter:onFailedToCreate", "Failed to create client: " + ex.getMessage());
            connectStatus = false;
          }
        }
      );
    }

    @ReactMethod
    public void connect(final Promise promise) {
      this.client.connect(new ConnectionListener() {
        @Override
        public void onConnected() {
          promise.resolve(true);
          connectStatus = true;
          sendEvent("FayeGitter:Connected", "CONNECTED");
        }
      });
    }

    @ReactMethod
    public void subscribe(String channelName) {
      if (connectStatus) {
        this.client.subscribe(channelName, new ChannelListener() {
          @Override
          public void onMessage(String channel, JsonObject message) {
            System.out.println(message);
            WritableMap params = new WritableNativeMap();
            params.putString("channel", channel);
            params.putString("json", message.toString());
            sendEvent("FayeGitter:Message", params);
          }

          @Override
          public void onFailed(String channel, Exception ex) {
            WritableMap params = new WritableNativeMap();
            params.putString("channel", channel);
            params.putString("Exception", ex.getMessage());
            sendEvent("FayeGitter:SubscribtionFailed", params);
          }
          @Override
          public void onSubscribed(String channel) {
            WritableMap params = new WritableNativeMap();
            params.putString("channel", channel);
            sendEvent("FayeGitter:Subscribed", params);
          }

          @Override
          public void onUnSubscribed(String channel) {
            WritableMap params = new WritableNativeMap();
            params.putString("channel", channel);
            sendEvent("FayeGitter:Unsubscribed", params);
          }
        });
      }
    }

    @ReactMethod
    public void unsubscribe(String channel) {
      if (connectStatus) {
        this.client.unSubscribe(channel);
      }
    }

    @ReactMethod
    public void disconnect() {
      this.client.disconnect();
      connectStatus = false;
    }

    @ReactMethod
    public void logger() {
      this.client.setLogger(new Logger() {
        @Override
        public void log(String message) {
          System.out.println(message);
          WritableMap params = new WritableNativeMap();
          params.putString("log", message);
          sendEvent("FayeGitter:log", params);
        }
      });
    }

    @ReactMethod
    public void checkConnectionStatus(Promise promise) {
      promise.resolve(connectStatus);
    }
}
