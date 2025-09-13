# 女神私密写真相册系统

一个响应式相册展示网站，支持PC端和移动端浏览。

## 功能特点

- 响应式设计，支持PC和移动端
- 多相册展示
- 轮播图展示
- 图片懒加载优化
- 模态框大图查看

## 项目结构

```
.
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript脚本
├── img/                # 小野猫相册图片目录
├── img2/               # 新春快乐相册图片目录
└── README.md           # 项目说明文件
```

## 部署到GitHub Pages

### 方法一：通过GitHub仓库设置

1. 将项目代码推送到GitHub仓库
2. 进入仓库的Settings页面
3. 找到"Pages"选项卡
4. 在"Source"部分选择：
   - Source: Deploy from a branch
   - Branch: 选择main或master分支，根目录
5. 点击"Save"保存设置
6. 等待几分钟，GitHub Pages会自动生成网站链接

### 方法二：使用GitHub Actions自动部署

1. 在项目根目录创建`.github/workflows`目录
2. 创建`deploy.yml`文件，内容如下：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

3. 推送代码到GitHub
4. 在仓库Settings的Pages选项中，选择GitHub Actions作为部署源

## 访问地址

部署完成后，可以通过以下地址访问：
```
https://<你的GitHub用户名>.github.io/<仓库名>/
```

## 注意事项

1. 确保所有文件路径都是相对路径
2. 图片文件已使用懒加载优化，提升页面加载速度
3. 响应式设计已适配移动端设备
4. 部署后如遇到图片不显示问题，请检查图片文件是否正确上传

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- 响应式设计
- CSS Flexbox & Grid

## 优化建议

1. 如需进一步优化性能，可考虑压缩图片文件
2. 可添加Service Worker实现离线访问
3. 可集成CDN加速静态资源加载