'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import ChatBackground from './chat-background'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import { avatarConfig } from './avatar-config'

export type IChatProps = {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  /**
   * 桌面端背景图片URL
   */
  backgroundImage?: string
  /**
   * 移动端背景图片URL
   */
  mobileBackgroundImage?: string
  userAvatar?: string
  assistantAvatar?: string
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  backgroundImage,
  mobileBackgroundImage,
  userAvatar = avatarConfig.userAvatar,
  assistantAvatar = avatarConfig.assistantAvatar,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
  }

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // 当聊天列表更新或正在响应状态变化时，自动滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [chatList, isResponding])

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery)
      setQuery('')
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend()))
      return
    onSend(query, files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    })))
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length)
        onClear()
      if (!isResponding)
        setQuery('')
    }
    // 发送消息后立即滚动到底部
    setTimeout(scrollToBottom, 100)
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      setQuery(query.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full relative')}>
      {/* 聊天背景 - 支持移动端和桌面端不同背景 */}
      <div className="fixed inset-0 z-0">
        <ChatBackground
          imageUrl={backgroundImage}
          mobileImageUrl={mobileBackgroundImage}
          opacity={0.03}
          blur={0}
          fixed={true}
        />
      </div>

      {/* Chat List Container */}
      <div
        className="h-full w-full md:max-w-4xl lg:max-w-5xl mx-auto relative pb-32 overflow-y-auto px-2 md:px-4"
        ref={chatContainerRef}
      >
        {/* 聊天消息列表 */}
        <div className="relative space-y-[30px] pt-4 z-10">
          {chatList.map((item) => {
            if (item.isAnswer) {
              const isLast = item.id === chatList[chatList.length - 1].id
              return <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                onImagesLoaded={scrollToBottom}
                allToolIcons={{}}
                assistantAvatar={assistantAvatar}
              />
            }
            return (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
                onImagesLoaded={scrollToBottom}
                userAvatar={userAvatar}
              />
            )
          })}
        </div>
      </div>
      {
        !isHideSendInput && (
          <div className="fixed z-10 bottom-0 left-0 right-0 backdrop-blur-sm pb-2 pt-1 bg-white/80 border-t border-gray-200">
            <div className="max-w-4xl lg:max-w-5xl mx-auto px-4">
              {
                visionConfig?.enabled && (
                  <>
                    <div className="absolute bottom-3 left-4 flex items-center">
                      <ChatImageUploader
                        settings={visionConfig}
                        onUpload={onUpload}
                        disabled={files.length >= visionConfig.number_limits}
                      />
                      <div className="mx-1 w-[1px] h-4 bg-black/5" />
                    </div>
                    <div className="pl-[52px]">
                      <ImageList
                        list={files}
                        onRemove={onRemove}
                        onReUpload={onReUpload}
                        onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                        onImageLinkLoadError={onImageLinkLoadError}
                      />
                    </div>
                  </>
                )
              }
              <div className="flex items-center relative">
                <div className="w-full relative rounded-full border border-gray-300 shadow-sm bg-white overflow-hidden">
                  <Textarea
                    className={`
                      block w-full pl-5 pr-14 py-2.5 leading-6 max-h-24 text-sm text-gray-700 outline-none appearance-none resize-none border-none
                      ${visionConfig?.enabled ? 'pl-14' : ''}
                    `}
                    value={query}
                    onChange={handleContentChange}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    autoSize
                    placeholder="输入消息..."
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Tooltip
                      selector="send-tip"
                      htmlContent={
                        <div>
                          <div>{t('common.operation.send')} Enter</div>
                          <div>{t('common.operation.lineBreak')} Shift Enter</div>
                        </div>
                      }
                    >
                      <button
                        className="w-8 h-8 flex items-center justify-center cursor-pointer text-white rounded-full bg-[#07C160] hover:bg-[#06b057] focus:outline-none transition-colors"
                        onClick={handleSend}
                        aria-label="发送消息"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
