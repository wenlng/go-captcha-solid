/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, onMount} from "solid-js";
import {createStore} from "solid-js/store";

import {SlideConfig, defaultConfig} from "./meta/config";
import {useHandler} from "./hooks/useHandler";
import {SlideData} from "./meta/data";
import {SlideEvent} from "./meta/event";

import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'
import LoadingIcon from './../../assets/icons/LoadingIcon'

export interface Props {
  data: SlideData,
  config?: SlideConfig;
  events?: SlideEvent,
}

const Index: Component<Props> = (props: Props) => {
  const [conf, setConf] = createStore<SlideConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setConf((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [data, setData] = createStore<SlideData>({
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

  const [events, setEvents] = createStore<SlideEvent>({});
  createEffect(() => {
    setEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  let containerRef: any = null
  let tileRef: any = null

  const handler = useHandler(data, events);

  const hPadding = conf.horizontalPadding || 0
  const vPadding = conf.verticalPadding || 0
  const width = (conf.width || 0) + ( hPadding * 2) + (conf.showTheme ? 2 : 0)

  const style = createMemo(() => ({
    "width":  width+ "px",
    "padding-left": hPadding + "px",
    "padding-right": vPadding + "px",
    "padding-top": vPadding + "px",
    "padding-bottom": vPadding + "px",
  }));

  onMount(() => {
    handler.initRefs(containerRef, tileRef)
    tileRef.addEventListener('dragstart', (event: any) => event.preventDefault());
  });

  return <div class="go-captcha gc-wrapper gc-slide-mode" classList={{"gc-theme": conf.showTheme}}
              style={style()}>
    <div class="gc-header gc-center">
      <span>{conf.title}</span>
    </div>
    <div class="gc-body" ref={containerRef} style={{width: conf.width + "px", height: conf.height + "px"}}>
      <div class="gc-loading">
        <LoadingIcon />
      </div>
      <img class="gc-picture" classList={{"gc-hide": data.image == ""}} src={data.image} style={{width: conf.width + "px", height: conf.height + "px"}} alt="..." />
      <div class="gc-tile" ref={tileRef} style={{width: (data.thumbWidth || 0) + 'px', height: (data.thumbHeight || 0) + 'px', top: handler.thumbPoint.y + "px", left: handler.thumbPoint.x + "px"}} onMouseDown={handler.dragEvent} onTouchStart={handler.dragEvent} >
        <img classList={{"gc-hide": data.thumb == ""}} src={data.thumb} alt="..."/>
      </div>
    </div>
    <div class="gc-footer">
      <div class="gc-icon-block">
        <CloseIcon width={20} height={20} onClick={handler.closeEvent}/>
        <RefreshIcon width={20} height={20} onClick={handler.refreshEvent}/>
      </div>
    </div>
  </div>
}

export default Index