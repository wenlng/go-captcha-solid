/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {SlideData} from "../meta/data";
import {SlideEvent} from "../meta/event";
import {checkTargetFather} from "../../../helper/helper";
import {createEffect, createSignal, on} from "solid-js";
import {SlideConfig} from "../meta/config";

export const useHandler = (
  data: SlideData,
  event: SlideEvent,
  config: SlideConfig,
  clearCbs: () => void
) => {
  let rootRef: HTMLDivElement
  let containerRef: HTMLDivElement
  let tileRef: HTMLDivElement
  let dragBlockRef: HTMLDivElement
  let dragBarRef: HTMLDivElement

  const [dragLeft, setDragLeft] = createSignal<number>(0)
  const [thumbLeft, setThumbLeft] = createSignal<number>(data.thumbX || 0)
  const [isFreeze, setIsFreeze] = createSignal<boolean>(false)

  createEffect(on([() => data.thumbX], () => {
    if(!isFreeze()){
      setThumbLeft(data.thumbX || 0)
    }
  }))

  const dragEvent = (e: Event|any) => {
    if (!checkTargetFather(dragBarRef, e)) {
      return
    }

    const touch = e.touches && e.touches[0];
    const offsetLeft = dragBlockRef.offsetLeft
    const width = containerRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth = width - blockWidth

    const tileWith  = tileRef.offsetWidth
    const tileOffsetLeft = tileRef.offsetLeft
    const containerMaxWidth = width - tileWith
    const tileMaxWith = width - (tileWith + tileOffsetLeft)
    const ratio = tileMaxWith / maxWidth

    let isMoving = false
    let tmpLeaveDragEvent: Event|any = null
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

      const ctX = tileOffsetLeft + (left * ratio)
      if (left >= maxWidth) {
        setDragLeft(maxWidth)
        currentThumbX = containerMaxWidth
        setThumbLeft(currentThumbX)
        return
      }

      if (left <= 0) {
        setDragLeft(0)
        currentThumbX = tileOffsetLeft
        setThumbLeft(currentThumbX)
        return
      }

      setDragLeft(left)
      currentThumbX = currentThumbX = ctX
      setThumbLeft(currentThumbX)

      event.move && event.move(currentThumbX, data.thumbY || 0)

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

      if (currentThumbX <= 0) {
        return
      }

      event.confirm && event.confirm({x: parseInt(currentThumbX.toString()), y: data.thumbY || 0}, () => {
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
    setThumbLeft(data.thumbX || 0)
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

  const getPoint = () => {
    return {
      x: thumbLeft(),
      y: data.thumbY || 0
    }
  }

  const initRefs = (
    root: HTMLDivElement,
    container: HTMLDivElement,
    tile: HTMLDivElement,
    dragBlock: HTMLDivElement,
    dragBar: HTMLDivElement
  ) => {
    rootRef = root
    containerRef = container
    tileRef = tile
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    initRefs,
    state: {
      dragLeft,
      thumbLeft
    },
    getPoint,
    dragEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}
