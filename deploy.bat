


IF NOT EXIST "./my-release-key.keystore" (
    REM  Generate the key store
    keytool -genkey -v -keystore my-release-key.keystore -alias mykeystore -keyalg RSA -keysize 2048 -validity 10000 -storepass 80849903D
)

IF "%1"=="build" (
    cd ./android
    gradlew assembleRelease & cd .. & deploy.bat
)

jarsigner -verbose -sigalg SHA1withRSA -storepass 80849903D -digestalg SHA1 -keystore my-release-key.keystore "./android/app/build/outputs/apk/release/app-release-unsigned.apk" mykeystore

IF EXIST ASM.apk (
    del ASM.apk
)

REM  Set path to zipalign
PATH = "C:\Users\davi-\AppData\Local\Android\Sdk\build-tools\33.0.0"

zipalign -v 4 "./android/app/build/outputs/apk/release/app-release-unsigned.apk" ASM.apk






