/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {SlideRegionData, SlideRegionPoint} from "../meta/data";
import {SlideRegionEvent} from "../meta/event";
import {checkTargetFather} from "../../../helper/helper";
import {createStore} from "solid-js/store";
import {SlideRegionConfig} from "../meta/config";
import {createEffect, createSignal, on} from "solid-js";

export const useHandler = (
  data: SlideRegionData,
  event: SlideRegionEvent,
  config: SlideRegionConfig,
  clearCbs: () => void,
) => {
  let rootRef: HTMLDivElement
  let containerRef: HTMLDivElement
  let tileRef: HTMLDivElement
  
  const [thumbPoint, setThumbPoint] = createStore<SlideRegionPoint>({x: data.thumbX || 0, y: data.thumbY || 0})
  const [isFreeze, setIsFreeze] = createSignal<boolean>(false)

  createEffect(on([() => data.thumbX, () => data.thumbY], () => {
    if(!isFreeze()){
      setThumbPoint({x: data.thumbX || 0, y: data.thumbY || 0})
    }
  }))

  const dragEvent = (e: Event|any) => {
    if (!checkTargetFather(containerRef, e)) {
      return
    }

    const touch = e.touches && e.touches[0];
    const offsetLeft = tileRef.offsetLeft
    const offsetTop = tileRef.offsetTop
    const width = containerRef.offsetWidth
    const height = containerRef.offsetHeight
    const tileWidth = tileRef.offsetWidth
    const tileHeight = tileRef.offsetHeight
    const maxWidth = width - tileWidth
    const maxHeight = height - tileHeight

    let isMoving = false
    let tmpLeaveDragEvent: Event|any = null
    let startX = 0
    let startY = 0
    let tileLeft = 0
    let tileTop = 0
    if (touch) {
      startX = touch.pageX - offsetLeft
      startY = touch.pageY - offsetTop
    } else {
      startX = e.clientX - offsetLeft
      startY = e.clientY - offsetTop
    }

    const moveEvent = (e: Event|any) => {
      isMoving = true
      const mTouche = e.touches && e.touches[0];

      let left = 0;
      let top = 0;
      if (mTouche) {
        left = mTouche.pageX - startX
        top = mTouche.pageY - startY
      } else {
        left = e.clientX - startX
        top = e.clientY - startY
      }

      if (left <= 0) {
        left = 0
      }

      if (top <= 0) {
        top = 0
      }

      if (left >= maxWidth) {
        left = maxWidth
      }

      if (top >= maxHeight) {
        top = maxHeight
      }

      setThumbPoint({x: left, y: top})
      tileLeft = left
      tileTop = top
      event.move && event.move(left, top)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(containerRef, e)) {
        return
      }

      clearEvent()
      if (!isMoving) {
        return
      }
      isMoving = false

      if (tileLeft < 0 || tileTop < 0) {
        return
      }

      event.confirm && event.confirm({x: tileLeft, y: tileTop}, () => {
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
    const dragDom = scope ? rootRef : containerRef
    const scopeDom = scope ? rootRef : document.body

    const clearEvent = () => {
      scopeDom.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      scopeDom.removeEventListener("touchmove", moveEvent, { passive: false })

      dragDom.removeEventListener( "mouseup", upEvent, false)
      dragDom.removeEventListener( "mouseout", upEvent, false)
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
    setThumbPoint({x: data.thumbX || 0, y: data.thumbY || 0})
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

  const initRefs = (root: HTMLDivElement, container: HTMLDivElement, tile: HTMLDivElement) => {
    rootRef = root
    containerRef = container
    tileRef = tile
  }

  return {
    initRefs,
    thumbPoint,
    dragEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}
