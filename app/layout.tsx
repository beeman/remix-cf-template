import {
	Anchor,
	Box,
	Flex,
	Group,
	Image,
	List,
	Stack,
	Text,
} from '@mantine/core';
import { Link, useLocation } from '@remix-run/react';
import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import chevronRightIcon from '~/assets/chevron-right.svg';
import chevronUpIcon from '~/assets/chevron-up.svg';
import remixLetterLogo from '~/assets/remix-letter-light.svg';

export interface Menu {
	title: string;
	links: Array<{
		title: string;
		to: string;
	}>;
}

export const useSafeLayoutEffect =
	typeof document === 'undefined' ? useEffect : useLayoutEffect;

export function Breadcrumbs({
	locationKey,
	trails,
	children,
}: {
	locationKey: string;
	trails: string[];
	children: React.ReactNode;
}) {
	const detailsRef = useRef<HTMLDetailsElement>(null);

	useSafeLayoutEffect(() => {
		if (detailsRef.current) {
			detailsRef.current.open = false;
		}
	}, [locationKey]);

	return (
		<>
			<Box
				component="details"
				id="breadcrumbs"
				ref={detailsRef}
				display={{ base: 'block', lg: 'none' }}
			>
				<Box component="summary">
					<Group mx="auto" gap="xs" align="center">
						<Image
							height={16}
							width={16}
							src={chevronRightIcon}
							display={{ base: 'none', lg: 'block' }}
							alt="expand"
							aria-hidden
						/>
						<Image
							height={16}
							width={16}
							src={chevronUpIcon}
							display={{ base: 'block', lg: 'none' }}
							alt="collapse"
							aria-hidden
						/>
						<div>
							{trails.map((trail, index) => (
								<Fragment key={index}>
									{index > 0 ? (
										<Text span px="xs" c="red">
											/
										</Text>
									) : null}
									<span>{trail}</span>
								</Fragment>
							))}
						</div>
					</Group>
				</Box>
			</Box>
			<div>{children}</div>
		</>
	);
}

export function MainNavigation({ menus }: { menus: Menu[] }) {
	const location = useLocation();
	const trails = menus.reduce<string[]>((result, menu) => {
		if (result.length === 0) {
			const link = menu.links.find(link => link.to === location.pathname);

			if (link) {
				return [menu.title, link.title];
			}
		}

		return result;
	}, []);

	return (
		<Flex direction="column" h={{ base: '100vh', lg: 'auto' }}>
			<Breadcrumbs locationKey={location.key} trails={trails}>
				<Flex
					component="nav"
					mx="auto"
					px="md"
					py={{ base: 'md', lg: 'xl' }}
					direction="column"
				>
					<Box component="header" px="sm" pb="md" pt="xs">
						<Anchor component={Link} to="/" display="inline-block">
							<Group>
								<Image
									height={32}
									width={32}
									display="inline-block"
									src={remixLetterLogo}
									alt="Remix logo"
								/>
								<Text size="lg">Cf Template</Text>
							</Group>
						</Anchor>
					</Box>
					<Stack style={{ overflowY: 'auto' }}>
						{menus.map(menu => (
							<Box px="xs" key={menu.title}>
								<Text fw="bold">{menu.title}</Text>
								<List listStyleType="none">
									{menu.links.map(link => (
										<List.Item key={link.to}>
											<Anchor component={Link} to={link.to}>
												<Group align="center" fz="sm" gap="xs">
													<Image
														height={16}
														width={16}
														src={chevronRightIcon}
														display={
															link.to === location.pathname ? 'block' : 'none'
														}
														alt="current page indicator"
														aria-hidden
													/>
													{link.title}
												</Group>
											</Anchor>
										</List.Item>
									))}
								</List>
							</Box>
						))}
					</Stack>
					<Box
						component="footer"
						pt="md"
						display={{ base: 'none', lg: 'block' }}
					>
						📜 All-in-one remix starter template for Cloudflare Pages
					</Box>
				</Flex>
			</Breadcrumbs>
		</Flex>
	);
}

export function Layout({
	children,
	menus,
}: {
	children?: React.ReactNode;
	menus: Menu[];
}) {
	return (
		<Box style={{ height: '100vh', overflow: 'hidden' }}>
			<Flex
				direction={{ base: 'column', lg: 'row' }}
				style={{ height: '100vh', overflow: 'auto' }}
			>
				<section>
					<MainNavigation menus={menus} />
				</section>
				<Box
					style={{ flexGrow: 1, overflow: 'auto' }}
					component="main"
					px={{ base: 'md', lg: 'xl' }}
					py={{ base: 'md', lg: 'xl' }}
				>
					{children}
				</Box>
			</Flex>
		</Box>
	);
}

export function ErrorLayout({
	title,
	description,
}: {
	title?: string;
	description?: string;
}) {
	return (
		<Flex justify="center" h="100vh">
			<Box mx="auto" p="md">
				<Text component="h2" size="xl">
					{title}
				</Text>
				<Text py="md">{description}</Text>
			</Box>
		</Flex>
	);
}
