/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, onMount, onCleanup} from "solid-js";
import {createStore} from "solid-js/store";
import {RotateConfig, defaultConfig} from "./meta/config";
import {useHandler} from "./hooks/useHandler";
import {defaultRotateData, RotateData} from "./meta/data";
import {RotateEvent} from "./meta/event";

import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'
import LoadingIcon from './../../assets/icons/LoadingIcon'
import ArrowsIcon from "../../assets/icons/ArrowsIcon";

export interface RotateRef {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}

export interface Props {
  data: RotateData,
  config?: RotateConfig;
  events?: RotateEvent,
  [x: string]: any,
}

const Index: Component<Props> = (props: Props) => {
  const [localConfig, setLocalConfig] = createStore<RotateConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setLocalConfig((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [localData, setLocalData] = createStore<RotateData>({
    ...defaultRotateData()
  });
  createEffect(() => {
    setLocalData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [localEvents, setLocalEvents] = createStore<RotateEvent>({});
  createEffect(() => {
    setLocalEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  let rootRef: any = null
  let dragBarRef: any = null
  let dragBlockRef: any = null

  const handler = useHandler(localData, localEvents, localConfig, () => {
    setLocalData({...localData, ...defaultRotateData()})
  })

  const hasDisplayWrapperState = createMemo(() => ((localConfig.width || 0) > 0 || (localConfig.height || 0) > 0))
  const hasDisplayImageState = createMemo(() => (localData.image != '' && localData.thumb != ''))
  const size = createMemo(() => ((localConfig.size || 0) > 0 ? localConfig.size : defaultConfig().size))

  const style = createMemo(() => {
    const hPadding = localConfig.horizontalPadding || 0
    const vPadding = localConfig.verticalPadding || 0
    const width = (localConfig.width || 0) + ( hPadding * 2) + (localConfig.showTheme ? 2 : 0)

    return {
      "width": width + "px",
      "padding-left": hPadding + "px",
      "padding-right": vPadding + "px",
      "padding-top": vPadding + "px",
      "padding-bottom": vPadding + "px",
      "display": hasDisplayWrapperState() ? 'block' : 'none'
    }
  })

  const fn = (event: any) => event.preventDefault()
  onMount(() => {
    handler.initRefs(rootRef, dragBlockRef, dragBarRef)
    dragBlockRef.addEventListener('dragstart', fn)
  })

  onCleanup(() => {
    dragBlockRef.removeEventListener('dragstart', fn)
  })

  return <div
    class="go-captcha gc-wrapper gc-rotate-mode"
    classList={{"gc-theme": localConfig.showTheme}}
    style={style()}
    ref={(el) => {
      rootRef = el
      props && props.ref && props.ref({
        current: el,
        reset: handler.resetData,
        clear: handler.clearData,
        refresh: handler.refresh,
        close: handler.close
      })
    }}
  >
    <div class="gc-header">
      <span>{localConfig.title}</span>
      <div class="gc-icon-block">
        <CloseIcon
          width={localConfig.iconSize}
          height={localConfig.iconSize} onClick={handler.closeEvent}
        />
        <RefreshIcon
          width={localConfig.iconSize}
          height={localConfig.iconSize}
          onClick={handler.refreshEvent}
        />
      </div>
    </div>
    <div
      class="gc-body"
      style={{
        width: localConfig.width + 'px',
        height: localConfig.height + 'px'
      }}
    >
      <div class="gc-body-inner" style={{width: size()  + "px", height: size() + "px" }}>
        <div class="gc-loading">
          <LoadingIcon />
        </div>

        <div
          class="gc-picture"
          style={{
            width: localConfig.size + 'px',
            height: localConfig.size + 'px'
          }}
        >
          <img
            classList={{"gc-hide": localData.image == ""}}
            src={localData.image}
            style={{ display: hasDisplayImageState() ? 'block' : 'none' }}
            alt=""
          />
          <div class="gc-round" />
        </div>

        <div class="gc-thumb">
          <div
            class="gc-thumb-block"
            style={{ transform: `rotate(${handler.state.thumbAngle()}deg)`}}
          >
            <img
              classList={{"gc-hide": localData.thumb == ""}}
              src={localData.thumb}
              style={{ display: hasDisplayImageState() ? 'block' : 'none' }}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="gc-footer">
      <div class="gc-drag-slide-bar" ref={dragBarRef}>
        <div class="gc-drag-line" />
        <div
          class="gc-drag-block"
          ref={dragBlockRef}
          onMouseDown={handler.dragEvent}
          style={{left: handler.state.dragLeft() + "px"}}
          classList={{"disabled": !hasDisplayImageState()}}
        >
          <div class="drag-block-inline" onTouchStart={handler.dragEvent} >
            <ArrowsIcon />
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Index