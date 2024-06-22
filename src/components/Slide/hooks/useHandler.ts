/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {SlideData} from "../meta/data";
import {SlideEvent} from "../meta/event";
import {checkTargetFather} from "../../../helper/helper";
import {createSignal} from "solid-js";

export const useHandler = (
  data: SlideData,
  event: SlideEvent
) => {
  let containerRef: HTMLDivElement
  let tileRef: HTMLDivElement
  let dragBlockRef: HTMLDivElement
  let dragBarRef: HTMLDivElement

  const [dragLeft, setDragLeft] = createSignal<number>(0)
  const [thumbLeft, setThumbLeft] = createSignal<number>(data.thumbX || 0)

  const clear = () => {
    setDragLeft(0)
    setThumbLeft(0)
  }

  const dragEvent = (e: Event|any) => {
    const touch = e.touches && e.touches[0];
    const offsetLeft = dragBlockRef.offsetLeft
    const width = containerRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth =width - blockWidth
    const thumbX = data.thumbX || 0

    const tileWith  = tileRef.offsetWidth
    const ad = blockWidth - tileWith
    const ratio = ((maxWidth - thumbX) + ad) / maxWidth

    let isMoving = false
    let startX = 0
    let currentThumbX = 0
    if (touch) {
      startX = touch.pageX - offsetLeft
    } else {
      startX = e.clientX - offsetLeft
    }

    const moveEvent = (e: Event|any) => {
      isMoving = true
      const mTouche = e.touches && e.touches[0];

      let left = 0;
      if (mTouche) {
        left = mTouche.pageX - startX
      } else {
        left = e.clientX - startX
      }

      if (left >= maxWidth) {
        setDragLeft(maxWidth)
        return
      }

      if (left <= 0) {
        setDragLeft(0)
        return
      }

      setDragLeft(left)
      currentThumbX = thumbX + (left * ratio)
      setThumbLeft(currentThumbX)

      event.move && event.move(currentThumbX, data.thumbY || 0)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(dragBarRef, e)) {
        return
      }

      if (!isMoving) {
        return
      }

      dragBarRef.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      dragBarRef.removeEventListener("touchmove", moveEvent, { passive: false })

      dragBarRef.removeEventListener( "mouseup", upEvent, false)
      dragBarRef.removeEventListener( "mouseout", upEvent, false)
      dragBarRef.removeEventListener("touchend", upEvent, false)

      isMoving = false
      event.confirm && event.confirm({x: parseInt(currentThumbX.toString()), y: data.thumbY || 0}, () => {
        clear()
      })

      e.cancelBubble = true
      e.preventDefault()
    }

    dragBarRef.addEventListener("mousemove", moveEvent, false)
    dragBarRef.addEventListener("touchmove", moveEvent, { passive: false })
    dragBarRef.addEventListener( "mouseup", upEvent, false)
    dragBarRef.addEventListener( "mouseout", upEvent, false)
    dragBarRef.addEventListener("touchend", upEvent, false)
  }

  const closeEvent = (e: Event|any) => {
    event && event.close && event.close()
    clear()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    event && event.refresh && event.refresh()
    clear()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const getPoint = () => {
    return {
      x: thumbLeft(),
      y: data.thumbY || 0
    }
  }

  const getState = () => {
    return {
      dragLeft: dragLeft(),
      thumbLeft: thumbLeft(),
    }
  }

  const initRefs = (container: HTMLDivElement, tile: HTMLDivElement, dragBlock: HTMLDivElement, dragBar: HTMLDivElement) => {
    containerRef = container
    tileRef = tile
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    initRefs,
    getState,
    getPoint,
    dragEvent,
    closeEvent,
    refreshEvent,
  }
}
