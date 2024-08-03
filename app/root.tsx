// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
// Rest of the imports
import type { MantineColorScheme } from '@mantine/core'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import {
	isRouteErrorResponse,
	json,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from '@remix-run/react'
import * as React from 'react'
import stylesUrl from '~/styles.css?url'
import { ErrorLayout, Layout, type Menu } from './layout'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const meta: MetaFunction = () => {
	return [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ title: 'remix-cf-template' },
	]
}

export function loader({ context, request }: LoaderFunctionArgs) {
	const cookies = request.headers.get('Cookie') ?? ''
	const key = 'mantine-color-scheme'
	const defaultColorScheme: MantineColorScheme = 'dark'
	const found = cookies.includes(key)
		? cookies
				.split(';')
				.find((cookie) => cookie.trim().startsWith(key))
				?.split('=')[1]
		: defaultColorScheme

	const colorScheme: MantineColorScheme = (
		['light', 'dark', 'auto'].includes(found ?? '') ? found : defaultColorScheme
	) as MantineColorScheme

	const menus: Menu[] = [
		{
			title: 'Docs',
			links: [
				{
					title: 'Overview',
					to: '/',
				},
			],
		},
		{
			title: 'Useful links',
			links: [
				{
					title: 'GitHub',
					to: `https://github.com/${context.env.GITHUB_OWNER}/${context.env.GITHUB_REPO}`,
				},
				{
					title: 'Remix docs',
					to: 'https://remix.run/docs',
				},
				{
					title: 'Cloudflare docs',
					to: 'https://developers.cloudflare.com/pages',
				},
			],
		},
	]

	return json({
		menus,
		colorScheme,
	})
}

// Action to set the color scheme
export function action({ request }: ActionFunctionArgs) {
	console.log(request)
	return { ok: true }
}

export default function App() {
	const { menus, colorScheme } = useLoaderData<typeof loader>()

	return (
		<Document colorScheme={colorScheme}>
			<Layout menus={menus}>
				<Outlet />
			</Layout>
		</Document>
	)
}

function Document({
	children,
	colorScheme = 'dark',
	title,
}: {
	children: React.ReactNode
	colorScheme?: MantineColorScheme
	title?: string
}) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				{title ? <title>{title}</title> : null}
				<Meta />
				<Links />
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider defaultColorScheme={colorScheme}>{children}</MantineProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	// Log the error to the console
	console.error(error)

	if (isRouteErrorResponse(error)) {
		const title = `${error.status} ${error.statusText}`

		let message
		switch (error.status) {
			case 401:
				message = 'Oops! Looks like you tried to visit a page that you do not have access to.'
				break
			case 404:
				message = 'Oops! Looks like you tried to visit a page that does not exist.'
				break
			default:
				message = JSON.stringify(error.data, null, 2)
				break
		}

		return (
			<Document title={title}>
				<ErrorLayout title={title} description={message} />
			</Document>
		)
	}

	return (
		<Document title="Error!">
			<ErrorLayout title="There was an error" description={`${error}`} />
		</Document>
	)
}
