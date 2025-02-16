/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {RotateData} from "../meta/data";
import {RotateEvent} from "../meta/event";
import {checkTargetFather} from "../../../helper/helper";
import {createEffect, createSignal, on} from "solid-js";
import {RotateConfig} from "../meta/config";

export const useHandler = (
  data: RotateData,
  event: RotateEvent,
  config: RotateConfig,
  clearCbs: () => void
) => {
  let rootRef: HTMLDivElement
  let dragBlockRef: HTMLDivElement
  let dragBarRef: HTMLDivElement
  
  const [dragLeft, setDragLeft] = createSignal<number>(0)
  const [thumbAngle, setThumbAngle] = createSignal<number>(data.angle || 0)
  const [isFreeze, setIsFreeze] = createSignal<boolean>(false)

  createEffect(on([()=>data.angle], () => {
    if(!isFreeze()){
      setThumbAngle(data.angle || 0)
    }
  }))

  const dragEvent = (e: Event|any) => {
    const touch = e.touches && e.touches[0];

    const offsetLeft = dragBlockRef.offsetLeft
    const width = dragBarRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth = width - blockWidth
    const maxAngle = 360
    const p = (maxAngle - (data.angle! || 0)) / maxWidth

    let angle = 0
    let isMoving = false
    let tmpLeaveDragEvent: Event|any = null
    let startX = 0;
    let currentAngle = 0
    if (touch) {
      startX = touch.pageX - offsetLeft
    } else {
      startX = e.clientX - offsetLeft
    }

    const moveEvent = (e: Event|any) => {
      if (!checkTargetFather(dragBarRef, e)) {
        return
      }

      isMoving = true
      const mTouche = e.touches && e.touches[0];

      let left = 0;
      if (mTouche) {
        left = mTouche.pageX - startX
      } else {
        left = e.clientX - startX
      }

      angle = (data.angle! || 0) + (left * p)

      if (left >= maxWidth) {
        setDragLeft(maxWidth)
        currentAngle = maxAngle
        setThumbAngle(currentAngle)
        return
      }

      if (left <= 0) {
        setDragLeft(0)
        currentAngle = data.angle || 0
        setThumbAngle(currentAngle)
        return
      }

      setDragLeft(left)
      currentAngle = angle
      setThumbAngle(angle)

      event.rotate && event.rotate(angle)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(dragBarRef, e)) {
        return
      }

      clearEvent()
      if (!isMoving) {
        return
      }

      isMoving = false

      if (currentAngle < 0) {
        return
      }

      event.confirm && event.confirm(parseInt(currentAngle.toString()), () => {
        resetData()
      })

      e.cancelBubble = true
      e.preventDefault()
    }

    const leaveDragBlockEvent = (e: Event|any) => {
      tmpLeaveDragEvent = e
    }

    const enterDragBlockEvent = () => {
      tmpLeaveDragEvent = null
    }

    const leaveUpEvent = (_: Event|any) => {
      if(!tmpLeaveDragEvent) {
        return
      }

      upEvent(tmpLeaveDragEvent)
      clearEvent()
    }

    const scope = config.scope
    const dragDom = scope ? rootRef : dragBarRef
    const scopeDom = scope ? rootRef : document.body

    const clearEvent = () => {
      scopeDom.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      scopeDom.removeEventListener("touchmove", moveEvent, { passive: false })

      dragDom.removeEventListener( "mouseup", upEvent, false)
      dragDom.removeEventListener( "mouseenter", enterDragBlockEvent, false)
      dragDom.removeEventListener( "mouseleave", leaveDragBlockEvent, false)
      dragDom.removeEventListener("touchend", upEvent, false)

      scopeDom.removeEventListener("mouseleave", upEvent, false)
      scopeDom.removeEventListener("mouseup", leaveUpEvent, false)

      setIsFreeze(false)
    }
    setIsFreeze(true)

    scopeDom.addEventListener("mousemove", moveEvent, false)
    scopeDom.addEventListener("touchmove", moveEvent, { passive: false })

    dragDom.addEventListener( "mouseup", upEvent, false)
    dragDom.addEventListener( "mouseenter", enterDragBlockEvent, false)
    dragDom.addEventListener( "mouseleave", leaveDragBlockEvent, false)
    dragDom.addEventListener("touchend", upEvent, false)

    scopeDom.addEventListener("mouseleave", upEvent, false)
    scopeDom.addEventListener("mouseup", leaveUpEvent, false)
  }

  const closeEvent = (e: Event|any) => {
    close()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    refresh()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const resetData = () => {
    setDragLeft(0)
    setThumbAngle(data.angle || 0)
  }

  const clearData = () => {
    resetData()
    clearCbs && clearCbs()
  }

  const close = () => {
    event.close && event.close()
    resetData()
  }

  const refresh = () => {
    event.refresh && event.refresh()
    resetData()
  }

  const initRefs = (root: HTMLDivElement, dragBlock: HTMLDivElement, dragBar: HTMLDivElement) => {
    rootRef = root
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    initRefs,
    state: {
      dragLeft,
      thumbAngle
    },
    thumbAngle,
    dragEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}
