# Peiran Li — Personal Website

## 文件夹结构

```
peiran-website/
├── index.html
└── photos/
    ├── travel/
    │   ├── hawaii/       ← 放夏威夷的照片
    │   ├── orlando/      ← 放奥兰多的照片
    │   ├── hongkong/     ← 放香港的照片
    │   └── japan/        ← 放日本的照片
    ├── life/             ← 放生活照片
    └── people/           ← 放朋友&家人照片
```

## 上传照片步骤

1. 把照片放进对应文件夹（文件名不要有空格，用 `-` 代替，例如 `beach-sunset.jpg`）
2. 打开 `index.html`，找到顶部的 `PHOTOS` 对象，填入文件名：

```js
const PHOTOS = {
  'city-hawaii':   ['beach.jpg', 'diamond-head.jpg', 'sunset.jpg'],
  'city-orlando':  ['disney.jpg', 'universal.jpg'],
  'grid-hk':       ['skyline.jpg', 'dimsum.jpg', 'cuhk.jpg'],
  'grid-jp':       ['tokyo.jpg', 'sakura.jpg', 'ramen.jpg'],
  'grid-life':     ['cafe.jpg', 'hiking.jpg', 'cooking.jpg'],
  'grid-people':   ['friends.jpg', 'family.jpg'],
};
```

3. 保存，推送到 GitHub 即可。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库（例如 `peiran-website`）
2. 把这个文件夹里的所有文件推上去：
   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin https://github.com/你的用户名/peiran-website.git
   git push -u origin main
   ```
3. 进入仓库 Settings → Pages → Source 选 `main` 分支
4. 几分钟后网站就上线了，地址是 `https://你的用户名.github.io/peiran-website`

## 照片建议

- 格式：JPG 或 WebP（WebP 更小更快）
- 尺寸：长边 1200px 足够，不需要原图（省流量）
- 第一张照片会显示为宽幅大图，选你最喜欢的那张放第一位
