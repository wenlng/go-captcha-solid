/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {ClickData, ClickDot} from "../meta/data";
import {ClickEvent} from "../meta/event";
import {getDomXY} from "../../../helper/helper";
import {createStore} from "solid-js/store";

export const useHandler = (
  _data: ClickData,
  event: ClickEvent,
) => {
  const [dots, setDots] = createStore<Array<ClickDot>>([])

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
    const index = dots.length
    setDots([...dots, {key: date.getTime(), index: index + 1, x: xx, y: yy}])

    event.click && event.click(xx, yy)
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const confirmEvent = (e: Event|any) => {
    const dotsStr = JSON.stringify(dots)
    let ds: Array<ClickDot> = []
    try {
      ds = JSON.parse(dotsStr)
    } catch (e) {
      console.warn("parse dots error", e)
    }

    event.confirm && event.confirm(ds, () => {
      setDots([])
    })
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const closeEvent = (e: Event|any) => {
    event.close && event.close()
    setDots([])
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    event.refresh && event.refresh()
    setDots([])
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  return {
    dots,
    clickEvent,
    confirmEvent,
    closeEvent,
    refreshEvent,
  }
}
