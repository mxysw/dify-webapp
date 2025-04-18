'use client'
import React, { useState, useEffect } from 'react'

/**
 * ChatBackground组件属性接口
 */
interface ChatBackgroundProps {
    /**
     * 桌面端背景图片URL，可以是相对路径或绝对路径
     * 如果不提供，将使用默认背景
     */
    imageUrl?: string
    /**
     * 移动端背景图片URL
     * 如果不提供，将使用桌面端背景图片(imageUrl)
     */
    mobileImageUrl?: string
    /**
     * 背景图片的不透明度，值范围0-1
     * 0表示完全透明，1表示完全不透明
     * 推荐值：
     * - 0.03-0.1: 非常淡的背景，几乎不可见
     * - 0.1-0.3: 淡淡的背景，不影响阅读
     * - 0.3-0.6: 中等强度背景，明显可见但不干扰
     * - 0.6-0.9: 高强度背景，非常明显
     * - 1.0: 完全不透明
     */
    opacity?: number
    /**
     * 背景图片尺寸，可使用CSS backgroundSize的值
     * 如：'cover'(覆盖整个容器),'contain'(完整显示),'100% 100%'等
     */
    backgroundSize?: string
    /**
     * 背景图片位置，可使用CSS backgroundPosition的值
     * 如：'center'(居中),'top'(顶部对齐),'50% 50%'等
     */
    backgroundPosition?: string
    /**
     * 背景图片模糊程度，单位为像素(px)
     * 0表示无模糊，值越大模糊效果越强
     */
    blur?: number
    /**
     * 容器类名，用于应用额外的样式
     */
    className?: string
    /**
     * 背景是否固定，不随滚动条移动
     */
    fixed?: boolean
}

/**
 * 默认背景渐变色
 * 当未提供背景图或背景图加载失败时使用此渐变背景
 */
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #f5f7fa 0%, #e4edf7 100%)';

/**
 * 检测当前是否为移动设备
 * @returns boolean 是否为移动设备
 */
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false; // 服务器端渲染时默认为桌面端

    // 检测是否为移动设备
    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768 // 小于768px的视口也被视为移动设备
    );
};

/**
 * 聊天背景组件
 * 
 * 该组件用于在聊天界面添加背景图片，并可以控制背景图的显示效果
 * 如透明度、模糊度、尺寸和位置等，使聊天界面更美观
 * 支持为移动端和桌面端配置不同的背景图片
 * 如果未提供背景图或背景图加载失败，则使用默认背景渐变
 */
const ChatBackground: React.FC<ChatBackgroundProps> = ({
    imageUrl, // 桌面端背景图片路径
    mobileImageUrl, // 移动端背景图片路径
    opacity = 0.03, // 默认较低透明度，使背景图不干扰内容
    backgroundSize = 'cover', // 默认覆盖整个容器
    backgroundPosition = 'center', // 默认居中显示
    blur = 0, // 默认无模糊效果，使背景图更清晰
    className = '',
    fixed = true, // 默认背景固定，不随滚动
}) => {
    // 根据设备类型选择使用的图片URL
    const [isMobile, setIsMobile] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(imageUrl);

    // 检测设备类型并选择对应的图片
    useEffect(() => {
        // 检测当前设备类型
        const checkMobile = () => {
            const mobile = isMobileDevice();
            setIsMobile(mobile);

            // 根据设备类型选择图片
            if (mobile && mobileImageUrl) {
                setCurrentImageUrl(mobileImageUrl);
            } else {
                setCurrentImageUrl(imageUrl);
            }
        };

        // 初始检测
        checkMobile();

        // 监听窗口大小变化，实时调整图片
        window.addEventListener('resize', checkMobile);

        // 移除事件监听
        return () => window.removeEventListener('resize', checkMobile);
    }, [imageUrl, mobileImageUrl]);

    // 检测图片是否存在和可用
    const [imageExists, setImageExists] = useState(false);

    useEffect(() => {
        // 如果没有提供图片URL，则不需要检查
        if (!currentImageUrl) {
            setImageExists(false);
            return;
        }

        // 检查图片是否可加载
        const img = new Image();
        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
        img.src = currentImageUrl;
    }, [currentImageUrl]);

    // 构建背景样式
    const style: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'relative',
    };

    // 如果有可用图片，使用背景图
    if (imageExists) {
        style.backgroundImage = `url(${currentImageUrl})`;
        style.backgroundSize = backgroundSize;
        style.backgroundPosition = backgroundPosition;
        style.backgroundRepeat = 'no-repeat';
        style.backgroundAttachment = fixed ? 'fixed' : 'scroll';
        style.opacity = opacity; // 应用透明度设置
        if (blur > 0) {
            style.filter = `blur(${blur}px)`;
        }
    } else {
        // 无图片时使用默认渐变背景
        style.backgroundImage = DEFAULT_GRADIENT;
        style.opacity = 1; // 默认背景使用100%不透明度
    }

    return (
        <div
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            style={style}
            data-device-type={isMobile ? 'mobile' : 'desktop'}
        />
    );
};

export default ChatBackground; 