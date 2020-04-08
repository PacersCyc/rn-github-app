package com.example.trackshare;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;

import com.example.util.Constants;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class TrackShare {
    public static void init(Context context){
        PlatformConfig.setWeixin(Constants.KEY_WEIXIN, Constants.SECRET_WEIXIN);
        PlatformConfig.setSinaWeibo(Constants.KEY_WEIBO, Constants.SECRET_WEIBO,"http://sns.whalecloud.com");
        PlatformConfig.setQQZone(Constants.KEY_QQ, Constants.SECRET_QQ);

        initRN("react-native","2.0");
        // UMConfigure.init(context,appkey,channel,type,secret);
        UMConfigure.init(context, "5e8c9337570df385cf00011d", "official", UMConfigure.DEVICE_TYPE_PHONE, null);
        UMConfigure.setLogEnabled(BuildConfig.DEBUG);
    }
    @TargetApi(Build.VERSION_CODES.KITKAT)
    private static void initRN(String v, String t){
        Method method = null;
        try {
            Class<?> config = Class.forName("com.umeng.commonsdk.UMConfigure");
            method = config.getDeclaredMethod("setWraperType", String.class, String.class);
            method.setAccessible(true);
            method.invoke(null, v,t);
        } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
