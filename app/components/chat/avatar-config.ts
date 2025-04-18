/**
 * 聊天头像配置
 * 可以在此处配置用户和助手的头像
 */

export interface AvatarConfig {
    // 用户头像路径
    userAvatar: string;
    // 助手头像路径
    assistantAvatar: string;
    // 用户头像背景色
    userBgColor: string;
    // 助手头像背景色
    assistantBgColor: string;
    // 用户默认显示文字（当没有头像时）
    userText: string;
    // 助手默认显示文字（当没有头像时）
    assistantText: string;
}

// 默认头像配置
const defaultAvatarConfig: AvatarConfig = {
    userAvatar: '/avatars/user-avatar.png',
    assistantAvatar: '/avatars/assistant-avatar.png',
    userBgColor: '#9BBF00',
    assistantBgColor: '#FA9D3B',
    userText: '用',
    assistantText: 'A',
};

// 使用环境变量或默认配置
export const avatarConfig: AvatarConfig = {
    userAvatar: process.env.NEXT_PUBLIC_USER_AVATAR || defaultAvatarConfig.userAvatar,
    assistantAvatar: process.env.NEXT_PUBLIC_ASSISTANT_AVATAR || defaultAvatarConfig.assistantAvatar,
    userBgColor: process.env.NEXT_PUBLIC_USER_BG_COLOR || defaultAvatarConfig.userBgColor,
    assistantBgColor: process.env.NEXT_PUBLIC_ASSISTANT_BG_COLOR || defaultAvatarConfig.assistantBgColor,
    userText: process.env.NEXT_PUBLIC_USER_TEXT || defaultAvatarConfig.userText,
    assistantText: process.env.NEXT_PUBLIC_ASSISTANT_TEXT || defaultAvatarConfig.assistantText,
};

// 导出一个获取头像配置的函数，以便后续扩展（比如从用户设置中读取）
export function getAvatarConfig(): AvatarConfig {
    return avatarConfig;
} 