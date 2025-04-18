'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'
import s from '../style.module.css'

import { Markdown } from '@/app/components/base/markdown'
import ImageGallery from '@/app/components/base/image-gallery'
import Avatar from '../avatar'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
  onImagesLoaded?: () => void
  userAvatar?: string
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs, onImagesLoaded, userAvatar }) => {
  return (
    <div className='flex items-start justify-end my-4' key={id}>
      <div className="max-w-[85%] md:max-w-[75%]">
        <div className="relative text-sm text-gray-900">
          <div
            style={{
              background: 'rgba(149, 236, 105, 0.9)', // 微信绿色，90%透明度
              boxShadow: '0 1px 1.5px rgba(0,0,0,0.04)', // 轻微阴影
              borderRadius: '4px', // 更微信风格的方形边角
            }}
            className='mr-2 py-3 px-4 break-words'
          >
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} onImagesLoaded={onImagesLoaded} />
            )}
            <Markdown content={content} />
          </div>
        </div>
      </div>
      <Avatar
        type="user"
        avatar={userAvatar}
        borderRadius="rounded"
      />
    </div>
  )
}

export default React.memo(Question)
