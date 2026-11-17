# Wedding Letter

React와 Vite로 만든 모바일 청첩장입니다.

## 시작하기

```bash
npm install
npm run dev
```

예식 정보는 `src/wedding.js`에서 한 번에 수정할 수 있습니다. 전체 스타일은 `src/styles.css`에 있습니다.

## GitHub Pages 배포

1. GitHub에서 빈 저장소를 만들고 이 프로젝트를 push합니다.
2. 저장소 **Settings → Pages → Build and deployment**의 Source를 **GitHub Actions**로 선택합니다.
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드하고 배포합니다.

Vite의 `base`가 상대 경로로 설정되어 있어 사용자 사이트와 프로젝트 사이트 모두에서 동작합니다.
