REM - remove android platform

rd /s /q android
rd /s /q www


REM - add android platform and apply settings for AndroidManifest
ionic build & npx cap sync & npx cap-config run config.yaml -y & ionic cap build android --no-open & xcopy /y ".\google-services.json" ".\android\app" & npx @capacitor/assets generate --iconBackgroundColor=#ffde33 --iconBackgroundColorDark=#ffde33 --splashBackgroundColor=#ffde33 --splashBackgroundColorDark=#ffde33