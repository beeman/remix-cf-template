import { TypographyStylesProvider } from '@mantine/core'
import markdoc, { type RenderableTreeNodes } from '@markdoc/markdoc'
import * as React from 'react'

export function Markdown({ content }: { content: RenderableTreeNodes }) {
	return <TypographyStylesProvider>{markdoc.renderers.react(content, React)}</TypographyStylesProvider>
}
