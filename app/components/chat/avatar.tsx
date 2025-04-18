'use client'
import React from 'react'
import { avatarConfig } from './avatar-config'

interface AvatarProps {
    // 头像类型：用户 或 助手
    type: 'user' | 'assistant'
    // 头像图片路径（如果提供，将覆盖配置中的默认头像）
    avatar?: string
    // 自定义背景色（如果提供，将覆盖配置中的默认背景色）
    bgColor?: string
    // 尺寸：小、中、大
    size?: 'small' | 'medium' | 'large'
    // 是否正在输入/响应
    isTyping?: boolean
    // 自定义加载动画组件
    loadingComponent?: React.ReactNode
    // 边框半径样式：方形、圆角方形、圆形
    borderRadius?: 'square' | 'rounded' | 'circle'
}

/**
 * 聊天头像组件
 */
const Avatar: React.FC<AvatarProps> = ({
    type,
    avatar,
    bgColor,
    size = 'medium',
    isTyping = false,
    loadingComponent,
    borderRadius = 'rounded', // 默认使用圆角方形（微信风格）
}) => {
    // 获取当前配置
    const config = avatarConfig;

    // 基于类型确定头像和背景色
    const avatarSrc = avatar || (type === 'user' ? config.userAvatar : config.assistantAvatar);
    const backgroundColor = bgColor || (type === 'user' ? config.userBgColor : config.assistantBgColor);
    const defaultText = type === 'user' ? config.userText : config.assistantText;

    // 基于尺寸确定样式
    const sizeClasses = {
        small: 'w-8 h-8 text-base',
        medium: 'w-10 h-10 text-lg',
        large: 'w-12 h-12 text-xl',
    };

    // 基于边框半径确定样式
    const radiusClasses = {
        square: 'rounded-none',
        rounded: 'rounded-md',
        circle: 'rounded-full',
    };

    // 检查avatarSrc是否是合法的URL或路径
    const hasValidAvatar = avatarSrc &&
        (avatarSrc.startsWith('http') || avatarSrc.startsWith('/'));

    return (
        <div
            className={`shrink-0 overflow-hidden flex items-center justify-center text-white relative ${sizeClasses[size]} ${radiusClasses[borderRadius]}`}
            style={{ backgroundColor }}
        >
            {hasValidAvatar ? (
                <img
                    src={avatarSrc}
                    alt={type === 'user' ? '用户' : '助手'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // 图片加载失败时使用默认文字
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.parentNode as HTMLElement).setAttribute('data-show-text', 'true');
                    }}
                />
            ) : (
                <span className="font-semibold">{defaultText}</span>
            )}

            {/* 当图片加载失败时显示默认文字 */}
            {hasValidAvatar && (
                <span className="font-semibold hidden" data-avatar-fallback>
                    {defaultText}
                </span>
            )}

            {/* 显示输入/响应中动画 */}
            {isTyping && (
                <div className="absolute top-0 right-0 bg-white rounded-full shadow-sm w-3 h-3 flex items-center justify-center">
                    {loadingComponent || (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Avatar; 