# 斜向策略・星空中文版創作卡

可直接部署到 GitHub Pages 的純前端靜態網站。

## 這一版的設計

- 深藍宇宙星空背景
- 44 張重新創作的繁體中文提示
- 淡紫色牌面與莫蘭迪色系幾何曼陀羅
- 初始只看到牌背，點牌後以 3D 翻牌顯示訊息
- 「下一張」會重新洗牌並回到牌背
- 背景音樂由 Web Audio API 即時生成空靈環境音，不需 MP3

> 44 則中文提示為重新創作內容，並非《Oblique Strategies》原版卡片的完整翻譯。

## GitHub Pages 更新方式

把 `index.html`、`style.css`、`app.js`、`README.md` 上傳到 repository 最外層（root），覆蓋舊檔即可。GitHub Pages 會自動重新部署。
