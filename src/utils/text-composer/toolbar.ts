// toolbar-controller.ts
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND
} from 'lexical'
import { $isListNode, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $isHeadingNode, type HeadingTagType } from '@lexical/rich-text'
import textComposer from './index'
import { ref } from 'vue'

export type TextBlockType = 'p' | HeadingTagType

export type ToolbarState = {
  block_type?: TextBlockType
  bold?: boolean
  italic?: boolean
  underline?: boolean
  list?: boolean
}

class ToolbarController {
  private _state = ref<ToolbarState>()
  private _unregister?: () => void

  constructor() {
    this._unregister = textComposer.registerUpdateListener(this._updateState)
  }

  destroy() {
    this._unregister?.()
  }

  get editor() {
    const editor = textComposer.getEditor()
    const root = textComposer.getActiveRoot()
    if (!editor || !root) return null

    return editor
  }

  get block_type() {
    return this._state.value?.block_type ?? 'p'
  }

  get bold() {
    return this._state.value?.bold ?? false
  }

  get italic() {
    return this._state.value?.italic ?? false
  }

  get underline() {
    return this._state.value?.underline ?? false
  }

  _updateState = (): void => {
    const editorState = this.editor?.getEditorState()
    editorState?.read(() => {
      this._state.value = this._readState()
    })
  }

  setParagraph = () => {
    this.editor?.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      $setBlocksType(selection, () => $createParagraphNode())
    })
  }

  setHeading = (tag: HeadingTagType) => {
    this.editor?.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      $setBlocksType(selection, () => $createHeadingNode(tag))
    })
  }

  toggleBold = () => {
    this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  }

  toggleItalic = () => {
    this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
  }

  toggleUnderline = () => {
    this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
  }

  toggleUnorderedList = () => {
    const cmd = this._state.value?.list ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND
    this.editor?.dispatchCommand(cmd, undefined)
  }

  private _readState(): ToolbarState {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return {}

    const anchorNode = selection.anchor.getNode()
    const topLevel = anchorNode.getTopLevelElementOrThrow()

    let block_type: TextBlockType = 'p'
    if ($isHeadingNode(topLevel)) {
      block_type = topLevel.getTag()
    }

    return {
      block_type,
      bold: selection.hasFormat('bold'),
      italic: selection.hasFormat('italic'),
      underline: selection.hasFormat('underline'),
      list: $isListNode(topLevel)
    }
  }
}

const toolbar_controller = new ToolbarController()
export default toolbar_controller
