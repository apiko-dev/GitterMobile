package com.terrysahaidak.bottomsheet;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;

import com.cocosw.bottomsheet.BottomSheet;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

class AndroidBottomSheet extends ReactContextBaseJavaModule {

    public AndroidBottomSheet(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AndroidBottomSheet";
    }

    @ReactMethod
    public void showBotttomSheetWithOptions(ReadableMap options, final Callback onSelect) {
        final ReadableArray itemsArray = options.getArray("items");
        final String title = options.getString("title");

        BottomSheet.Builder builder = new BottomSheet.Builder(getCurrentActivity()).title(title);

        // create options
        Integer size = itemsArray.size();
        for (int i = 0; i < size; i++) {
            builder.sheet(i, itemsArray.getString(i));
        }

        builder.listener(new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                onSelect.invoke(which, itemsArray.getString(which));
            }
        });

        builder.build().show();
    }

    @ReactMethod
    public void showShareActionSheetWithOptions(ReadableMap options, Callback failureCallback, Callback successCallback) {
        String url = options.getString("url");
        String message = options.getString("message");

        BottomSheet.Builder builder = new BottomSheet.Builder(getCurrentActivity());
        final Intent shareIntent = new Intent(Intent.ACTION_SEND);

        failureCallback.invoke("not support this method");
    }

}
