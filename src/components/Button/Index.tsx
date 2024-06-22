/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {ButtonConfig, defaultConfig} from "./meta/config";
import BtnDefaultIcon from "../../assets/icons/BtnDefaultIcon";
import BtnErrorIcon from "../../assets/icons/BtnErrorIcon";
import BtnWarnIcon from "../../assets/icons/BtnWarnIcon";
import BtnSuccessIcon from "../../assets/icons/BtnSuccessIcon";
import {Component, createEffect, createMemo} from "solid-js";
import {ButtonState, Props} from "./meta/types";
import {createStore} from "solid-js/store";

const Index: Component<Props> = (props) => {
  const [conf, setConf] = createStore<ButtonConfig>({
    ...defaultConfig(),
  });

  createEffect(() => {
    setConf((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [state, setState] = createStore<ButtonState>({
    disabled: false,
    type: "default",
    title: "点击按键进行验证",
  });

  createEffect(() => {
    setState((s) => ({
      disabled: props.disabled ?? s.disabled,
      type: props.type ?? s.type,
      title: props.title ?? s.title
    }));
  });

  const type = createMemo(() => {
    const type = state?.type || "default"
    let t = "default"
    if (type == "warn") {
      t = "warn"
    } else if (type == "error") {
      t = "error"
    } else if (type == "success") {
      t = "success"
    }
    return t
  })

  const btnIcon = createMemo(() => {
    const type = state?.type || "default"
    let btnIcon = <BtnDefaultIcon />
    if (type == "warn") {
      btnIcon = <BtnWarnIcon />
    } else if (type == "error") {
      btnIcon = <BtnErrorIcon />
    } else if (type == "success") {
      btnIcon = <BtnSuccessIcon />
    }
    return btnIcon
  })

  const style = createMemo(() => ({
    "width": conf.width + "px",
    "height": conf.height + "px",
    "padding-left": conf.horizontalPadding + "px",
    "padding-right": conf.horizontalPadding + "px",
    "padding-top": conf.verticalPadding + "px",
    "padding-bottom": conf.verticalPadding + "px",
  }));

  return <div
    class={`go-captcha gc-button-mode gc-btn-block gc-${type()}`}
    classList={{"gc-disabled" : state?.disabled}}
    style={style()}
    onClick={props.clickEvent}
  >
    {type() == "default" ? <div class="gc-ripple">{btnIcon()}</div> : btnIcon()}
    <span>{state?.title || "点击按键进行验证"}</span>
  </div>
}

export default Index