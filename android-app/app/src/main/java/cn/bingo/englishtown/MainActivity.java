package cn.bingo.englishtown;

import android.app.Activity;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import java.util.Locale;

public class MainActivity extends Activity {
    private TextToSpeech tts;
    private WebView web;
    private PermissionRequest pendingPermission;
    private static final int AUDIO_PERMISSION = 81;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(0xfff6f8f3);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        web.setWebViewClient(new WebViewClient() {
            @Override public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, android.webkit.WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
        });
        web.setWebChromeClient(new android.webkit.WebChromeClient() {
            @Override public void onPermissionRequest(PermissionRequest request) {
                boolean asksForAudio = false;
                for (String resource : request.getResources()) if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) asksForAudio = true;
                if (!asksForAudio) { request.deny(); return; }
                if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                    request.grant(new String[] { PermissionRequest.RESOURCE_AUDIO_CAPTURE });
                } else {
                    pendingPermission = request;
                    requestPermissions(new String[] { Manifest.permission.RECORD_AUDIO }, AUDIO_PERMISSION);
                }
            }
        });
        tts = new TextToSpeech(this, status -> { if (status == TextToSpeech.SUCCESS) tts.setLanguage(Locale.US); });
        web.addJavascriptInterface(new AndroidTts(), "AndroidTts");
        setContentView(web);
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode == AUDIO_PERMISSION && pendingPermission != null) {
            if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED) pendingPermission.grant(new String[] { PermissionRequest.RESOURCE_AUDIO_CAPTURE });
            else pendingPermission.deny();
            pendingPermission = null;
        }
    }

    private class AndroidTts {
        @JavascriptInterface public void speak(String text) {
            if (tts == null || text == null) return;
            Locale locale = text.matches(".*[\\u3400-\\u9fff].*") ? Locale.SIMPLIFIED_CHINESE : Locale.US;
            int languageResult = tts.setLanguage(locale);
            if (languageResult == TextToSpeech.LANG_MISSING_DATA || languageResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "请在平板设置中安装英语语音数据", Toast.LENGTH_LONG).show());
                return;
            }
            tts.stop();
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "english-town");
        }
    }

    @Override protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        super.onDestroy();
    }
}
