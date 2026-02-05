# TWA (Trusted Web Activity)로 APK 빌드 가이드

## TWA란?
Trusted Web Activity는 Chrome 브라우저를 사용하여 웹앱을 네이티브 앱처럼 실행하는 방식입니다.
- ✅ Java/Android Studio 불필요
- ✅ Vercel 배포 시 자동 업데이트
- ✅ 명령줄로 간단히 APK 생성
- ⚠️ 인터넷 연결 필수

## 빌드 전 준비

1. **Vercel에 배포**
   ```bash
   npm run build
   # Vercel에 배포하여 https://musclecat-sns.vercel.app 접근 가능하게 만들기
   ```

2. **manifest.json이 정상적으로 로드되는지 확인**
   - 브라우저에서 `https://musclecat-sns.vercel.app/manifest.json` 접속
   - 아이콘 파일들도 정상 로드되는지 확인

## APK 빌드 방법

### 1. Bubblewrap CLI 설치 (이미 완료됨)
```bash
npm install -g @bubblewrap/cli
```

### 2. TWA 프로젝트 초기화
```bash
bubblewrap init --manifest https://musclecat-sns.vercel.app/manifest.json
```

프롬프트에서 다음 정보 입력:
- **Domain**: `musclecat-sns.vercel.app`
- **URL path**: `/`
- **Application name**: `MuscleCat SNS`
- **Short name**: `MuscleCat`
- **Application ID**: `app.vercel.musclecat_sns.twa`
- **Display mode**: `standalone`
- **Status bar color**: `#FFFFFF`
- **Icon URL**: `https://musclecat-sns.vercel.app/icon-512.png`
- **Key store location**: `./android.keystore`
- **Key name**: `android`

### 3. APK 빌드
```bash
bubblewrap build
```

생성된 APK 위치: `app-release-signed.apk`

### 4. APK를 E-ink 디바이스에 설치
```bash
# USB로 연결된 디바이스에 직접 설치
adb install app-release-signed.apk

# 또는 파일을 디바이스로 전송 후 설치
```

## 간편 명령어 (한 번에 빌드)

```bash
# 빌드만
bubblewrap build

# 빌드 + 디바이스 설치
bubblewrap build && adb install app-release-signed.apk
```

## 업데이트 방법

TWA는 웹 기반이므로:
1. Vercel에 새 버전 배포
2. 앱에서 **새로고침만 하면 자동 업데이트**
3. APK 재빌드 불필요!

단, 앱 이름/아이콘 등 manifest.json 변경 시에만 재빌드 필요

## 문제 해결

### Keystore 패스워드 관련 오류
- 첫 빌드 시 keystore가 자동 생성됨
- 패스워드를 잊어버린 경우 `android.keystore` 삭제 후 재생성

### Manifest 로드 실패
- Vercel에 manifest.json이 배포되었는지 확인
- CORS 설정 확인
- 아이콘 파일 경로 확인

### 디지털 자산 링크 오류
- Bubblewrap이 자동으로 `.well-known/assetlinks.json` 생성
- Vercel에 이 파일도 함께 배포되어야 함

## 참고 자료

- [Bubblewrap 문서](https://github.com/GoogleChromeLabs/bubblewrap)
- [TWA 가이드](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Web Manifest 문서](https://web.dev/add-manifest/)
