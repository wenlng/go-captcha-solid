/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {ClickData, ClickDot} from "../meta/data";
import {ClickEvent} from "../meta/event";
import {getDomXY} from "../../../helper/helper";
import {createSignal} from "solid-js";

export const useHandler = (
  _data: ClickData,
  event: ClickEvent,
  clearCbs: () => void
) => {
  const [dots, setDots] = createSignal<Array<ClickDot>>([])

  const clickEvent = (e: Event|any) => {
    const dom = e.currentTarget
    const xy = getDomXY(dom)

    const mouseX = e.pageX || e.clientX
    const mouseY = e.pageY || e.clientY

    const domX = xy.domX
    const domY = xy.domY

    const xPos = mouseX - domX;
    const yPos = mouseY - domY;

    const xx = parseInt(xPos.toString())
    const yy = parseInt(yPos.toString())
    const date = new Date()
    const index = dots().length
    setDots([...dots(), {key: date.getTime(), index: index + 1, x: xx, y: yy}])

    event.click && event.click(xx, yy)
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const confirmEvent = (e: Event|any) => {
    const ds: Array<ClickDot> = dots()
    event.confirm && event.confirm(ds, () => {
      resetData()
    })
    e.cancelBubble = true
    e.preventDefault()
    return false
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
    setDots([])
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

  return {
    dots,
    clickEvent,
    confirmEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}
