/**
 * @Author Awen
 * @Date 2024/05/25
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, onMount} from "solid-js";
import {createStore} from "solid-js/store";
import {CaptchaData} from "./meta/data";
import {CaptchaConfig, defaultConfig} from "./meta/config";
import {CaptchaEvent} from "./meta/event";
import {useHandler} from "./hooks/useHandler";

import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'
import LoadingIcon from './../../assets/icons/LoadingIcon'
import ArrowsIcon from './../../assets/icons/ArrowsIcon'

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
    thumbX: 0,
    thumbY: 0,
    thumbWidth: 0,
    thumbHeight: 0,
    image: "",
    thumb: "",
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
  let containerRef: any = null
  let dragBlockRef: any = null
  let tileRef: any = null

  const handler = useHandler(data, events)

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
    handler.initRefs(containerRef, tileRef, dragBlockRef, dragBarRef)
  })

  return <div class="go-captcha wrapper slideMode" classList={{"theme": conf.showTheme}} style={style()}>
    <div class="header">
      <span>{conf.title}</span>
      <div class="iconBlock">
        <CloseIcon width={22} height={22} onClick={handler.closeEvent}/>
        <RefreshIcon width={22} height={22} onClick={handler.refreshEvent}/>
      </div>
    </div>
    <div class="body" ref={containerRef} style={{width: conf.width + "px", height: conf.height + "px"}}>
      <div class="loading">
        <LoadingIcon />
      </div>
      <img class="picture" classList={{"hide": data.image == ""}} style={{width: conf.width + "px", height: conf.height + "px"}} src={data.image} alt="..." />
      <div class="tile" ref={tileRef} style={{width: (data.thumbWidth || 0) + 'px', height: (data.thumbHeight || 0) + 'px', top: (data.thumbY || 0) + "px", left: handler.getState().thumbLeft + "px"}}>
        <img classList={{"hide": data.thumb == ""}} src={data.thumb} alt="..."/>
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