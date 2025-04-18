# 聊天背景图片功能

本功能允许在聊天界面显示一个自定义的背景图片，增强用户体验。

## 使用方法

### 1. 默认背景图片

在 `public` 目录下放置一个名为 `chat-background.jpg` 的图片文件，系统将自动加载该图片作为聊天背景。

### 2. 自定义背景图片

如果您想使用不同的背景图片，可以修改 `app/components/index.tsx` 文件中的以下代码：

```typescript
// 修改背景图片路径
const [chatBackgroundImage, setChatBackgroundImage] = useState<string>('/your-custom-image.jpg')
```

### 3. 自定义背景样式

您可以通过修改 `app/components/chat/chat-background.tsx` 文件来调整背景图片的显示效果：

```typescript
// 示例：修改透明度和模糊效果
<ChatBackground 
  imageUrl={backgroundImage} 
  opacity={0.1} // 降低透明度
  blur={2} // 添加轻微模糊效果
/>
```

可自定义的属性包括：
- `imageUrl`: 图片路径
- `opacity`: 透明度 (0-1)
- `backgroundSize`: 背景大小 ('cover', 'contain', '100%' 等)
- `backgroundPosition`: 背景位置 ('center', 'top', 'bottom' 等)
- `blur`: 模糊效果 (单位: 像素)

## 注意事项

1. 建议使用不影响文字可读性的背景图片
2. 图片不宜过大，以免影响加载速度
3. 如果背景图片过于明亮，可以降低透明度或增加模糊效果 