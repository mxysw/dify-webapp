# 聊天头像自定义功能

本功能允许在聊天界面为用户和助手设置自定义头像，增强用户体验。

## 使用方法

### 1. 放置头像图片文件

在 `public/avatars` 目录下放置头像图片文件：

- 用户头像：`user-avatar.png`（或其他图片格式）
- 助手头像：`assistant-avatar.png`（或其他图片格式）

### 2. 通过配置文件自定义

您可以编辑 `app/components/chat/avatar-config.ts` 文件来修改默认配置：

```typescript
// 默认头像配置
const defaultAvatarConfig: AvatarConfig = {
  userAvatar: '/avatars/user-avatar.png',     // 修改为您的用户头像路径
  assistantAvatar: '/avatars/assistant-avatar.png',  // 修改为您的助手头像路径
  userBgColor: '#9BBF00',     // 用户头像背景色（当没有图片时）
  assistantBgColor: '#FA9D3B', // 助手头像背景色（当没有图片时）
  userText: '用',             // 用户头像默认文字
  assistantText: 'A',         // 助手头像默认文字
};
```

### 3. 通过环境变量配置

您也可以通过环境变量来配置头像：

```
NEXT_PUBLIC_USER_AVATAR=/path/to/user-avatar.png
NEXT_PUBLIC_ASSISTANT_AVATAR=/path/to/assistant-avatar.png
NEXT_PUBLIC_USER_BG_COLOR=#9BBF00
NEXT_PUBLIC_ASSISTANT_BG_COLOR=#FA9D3B
NEXT_PUBLIC_USER_TEXT=用
NEXT_PUBLIC_ASSISTANT_TEXT=A
```

### 4. 通过代码动态设置

在主组件中，您可以动态设置头像：

```typescript
// 聊天头像配置
const [userAvatar, setUserAvatar] = useState<string>('/avatars/user-avatar.png')
const [assistantAvatar, setAssistantAvatar] = useState<string>('/avatars/assistant-avatar.png')

// 更改头像
const changeUserAvatar = (newAvatarPath) => {
  setUserAvatar(newAvatarPath);
}
```

## 头像组件属性

`Avatar` 组件支持以下属性：

- `type`: 'user' | 'assistant' - 头像类型
- `avatar`: string - 头像图片路径
- `bgColor`: string - 背景色
- `size`: 'small' | 'medium' | 'large' - 头像尺寸
- `isTyping`: boolean - 是否显示输入/响应状态
- `loadingComponent`: React.ReactNode - 自定义加载动画

## 注意事项

1. 头像图片建议使用正方形图片，推荐尺寸为 256x256 像素
2. 支持的图片格式包括：PNG、JPG、JPEG、SVG、WebP
3. 如果头像图片加载失败，将显示配置中设置的默认文字 