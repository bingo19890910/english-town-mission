# Android APK 构建说明

这是英语小城网页的离线 Android 壳。构建前把 `04_Deliverables` 中的网页文件复制到 `app/src/main/assets`；应用通过 Android 原生 `TextToSpeech` 提供 `AndroidTts.speak()`，不依赖浏览器的 `speechSynthesis`。

GitHub Actions 会自动复制网页资源并生成 debug APK。debug APK 适合家庭自用安装，不代表应用商店发布包。
