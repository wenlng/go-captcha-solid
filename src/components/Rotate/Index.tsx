/**
 * @Author Awen
 * @Date 2024/05/25
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, onMount} from "solid-js";
import {createStore} from "solid-js/store";
import {CaptchaConfig, defaultConfig} from "./meta/config";
import {useHandler} from "./hooks/useHandler";
import {CaptchaData} from "./meta/data";
import {CaptchaEvent} from "./meta/event";

import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'
import LoadingIcon from './../../assets/icons/LoadingIcon'
import ArrowsIcon from "../../assets/icons/ArrowsIcon";

export interface Props {
  data: CaptchaData,
  config?: CaptchaConfig;
  events?: CaptchaEvent,
}

const Index: Component<Props> = (props: Props) => {
  const [conf, setConf] = createStore<CaptchaConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setConf((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [data, setData] = createStore<CaptchaData>({
    angle: 0,
    image: "",
    thumb: ""
  });
  createEffect(() => {
    setData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [events, setEvents] = createStore<CaptchaEvent>({});
  createEffect(() => {
    setEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  let dragBarRef: any = null
  let dragBlockRef: any = null

  const handler = useHandler(data, events);

  const hPadding = conf.horizontalPadding || 0
  const vPadding = conf.verticalPadding || 0
  const width = (conf.width || 0) + ( vPadding * 2)

  const style = createMemo(() => ({
    "width":  width+ "px",
    "padding-left": vPadding + "px",
    "padding-right": vPadding + "px",
    "padding-top": hPadding + "px",
    "padding-bottom": hPadding + "px",
  }));

  onMount(() => {
    handler.initRefs(dragBlockRef, dragBarRef)
  })

  return <div class="go-captcha wrapper rotateMode" classList={{"theme": conf.showTheme}}
              style={style()}>
    <div class="header">
      <span>{conf.title}</span>
      <div class="iconBlock">
        <CloseIcon width={22} height={22} onClick={handler.closeEvent}/>
        <RefreshIcon width={22} height={22} onClick={handler.refreshEvent}/>
      </div>
    </div>
    <div class="body" style={{width: conf.size + 'px', height: conf.size + 'px'}}>
      <div class="loading">
        <LoadingIcon />
      </div>

      <div class="picture" style={{width: conf.size + 'px', height: conf.size + 'px'}}>
        <img classList={{"hide": data.image == ""}} src={data.image} alt="..." />
        <div class="round" />
      </div>

      <div class="thumb">
        <div class="thumbBlock" style={{ transform: `rotate(${handler.getState().thumbAngle}deg)`}}>
          <img classList={{"hide": data.thumb == ""}} src={data.thumb} alt="..." />
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="dragSlideBar" ref={dragBarRef} onMouseDown={handler.dragEvent}>
        <div class="dragLine" />
        <div class="dragBlock" ref={dragBlockRef} onTouchStart={handler.dragEvent} style={{left: handler.getState().dragLeft + "px"}}>
          <ArrowsIcon />
        </div>
      </div>
    </div>
  </div>
}

export default Index