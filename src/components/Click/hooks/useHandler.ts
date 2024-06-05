/**
 * @Author Awen
 * @Date 2024/05/25
 * @Email wengaolng@gmail.com
 **/

import {createSignal} from 'solid-js';
import {CaptchaData, CaptchaDot} from "../meta/data";
import {CaptchaEvent} from "../meta/event";
import {getDomXY} from "../../../helper/helper";

export const useHandler = (
  _data: CaptchaData,
  event: CaptchaEvent,
) => {
  const [dots, setDots] = createSignal<Array<CaptchaDot>>([])

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
    event.confirm && event.confirm(dots(), () => {
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
