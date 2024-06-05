/**
 * @Author Awen
 * @Date 2024/05/25
 * @Email wengaolng@gmail.com
 **/

import {CaptchaData} from "../meta/data";
import {CaptchaEvent} from "../meta/event";
import {checkTargetFather} from "../../../helper/helper";
import {createSignal} from "solid-js";

export const useHandler = (
  data: CaptchaData,
  event: CaptchaEvent,
) => {
  let dragBlockRef: HTMLDivElement
  let dragBarRef: HTMLDivElement
  
  const [dragLeft, setDragLeft] = createSignal<number>(0)
  const [thumbAngle, setThumbAngle] = createSignal<number>(data.angle || 0)

  const clear = () => {
    setDragLeft(0)
    setThumbAngle(0)
  }

  const dragEvent = (e: Event|any) => {
    const touch = e.touches && e.touches[0];

    const offsetLeft = dragBlockRef.offsetLeft
    const width = dragBarRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth = width - blockWidth
    const p = 360 / maxWidth

    let angle = 0
    let isMoving = false
    let startX = 0;
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
      angle = (left * p)
      setThumbAngle(angle)

      event.rotate && event.rotate(angle)

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
      event.confirm && event.confirm(parseInt(angle.toString()), () => {
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

  const getState = () => {
    return {
      dragLeft: dragLeft(),
      thumbAngle: thumbAngle(),
    }
  }

  const initRefs = (dragBlock: HTMLDivElement, dragBar: HTMLDivElement) => {
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    initRefs,
    getState,
    thumbAngle,
    dragEvent,
    closeEvent,
    refreshEvent,
  }
}
