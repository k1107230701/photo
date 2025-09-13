# GitHub Pages 部署检查清单

## 基础检查

- [ ] 仓库名称是否正确：`k1107230701.github.io`
- [ ] 代码是否已推送到GitHub
- [ ] 是否在正确的分支上（main或master）
- [ ] index.html文件是否在根目录

## GitHub Pages 设置检查

- [ ] 进入仓库 Settings > Pages
- [ ] Source 是否设置为 "Deploy from a branch"
- [ ] Branch 是否选择正确（main或master）
- [ ] Folder 是否为 "/(root)"

## 文件结构检查

```
仓库根目录/
├── index.html          ← 主页面（必须在根目录）
├── style.css
├── script.js
├── 404.html           ← 自定义404页面
├── README.md
├── img/               ← 图片目录
│   ├── *.jpeg
├── img2/              ← 图片目录2
│   ├── *.jpeg
```

## 常见问题解决方案

### 问题1：显示404页面
**可能原因：**
1. 仓库名称不正确
2. index.html不在根目录
3. 分支设置不正确
4. 部署尚未完成

**解决方案：**
1. 确认仓库名称为 `k1107230701.github.io`
2. 确认index.html在根目录
3. 检查GitHub Pages设置中的分支
4. 等待5-10分钟让部署完成

### 问题2：样式或图片不显示
**可能原因：**
1. CSS/JS文件路径错误
2. 图片路径错误

**解决方案：**
1. 确保所有路径都是相对路径
2. 检查控制台是否有404错误

### 问题3：自定义域名不工作
**可能原因：**
1. CNAME文件设置不正确
2. DNS设置不正确

**解决方案：**
1. 确保CNAME文件只包含域名，无其他内容
2. 在域名提供商处设置正确的DNS记录

## 部署后检查步骤

1. 访问 https://k1107230701.github.io/
2. 等待1-10分钟直到页面显示
3. 检查浏览器控制台是否有错误
4. 确认所有图片和样式正常加载

## 强制重新部署方法

如果需要强制重新部署：
```bash
# 在项目目录中执行
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

## 联系支持

如果以上步骤都无法解决问题：
1. 检查GitHub状态页面：https://www.githubstatus.com/
2. 查看GitHub Pages文档：https://docs.github.com/pages
3. 在GitHub社区寻求帮助