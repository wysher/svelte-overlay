<script>
	import {
		beforeUpdate,
		onMount,
		onDestroy,
		tick,
		createEventDispatcher,
	} from 'svelte';
	import POSITIONS from './positions';
	import { getMainPosition, getSecondaryPosition } from './helpers';
	const dispatch = createEventDispatcher();

	const DEFAULT_POSITION = POSITIONS[0];

	export let isOpen = false;
	export let position = DEFAULT_POSITION;
	export let closeOnClickOutside = false;
	export let onWindowKeyDown = () => {};

	let currentPosition = null;
	let parent;
	let contentWrapper;
	let content;
	let portal;

	let topStyle = 0;
	let leftStyle = 0;
	let widthStyle = 0;
	let heightStyle = 0;

	onMount(() => {
		portal = document.createElement('div');
		document.body.appendChild(portal);
		portal.appendChild(contentWrapper);
	});

	onDestroy(() => {
		window.removeEventListener('resize', updatePosition);
		document.body.removeChild(portal);
	});

	beforeUpdate(() => {
		if (!isOpen) return;
		updatePosition();
	});

	function toggle(value) {
		isOpen = value === true || value === false ? value : !isOpen;

		dispatch('toggle', isOpen);
		if (isOpen) {
			window.addEventListener('resize', updatePosition);
			dispatch('open');
		} else {
			dispatch('close');
			window.removeEventListener('resize', updatePosition);
		}
	}

	function open() {
		if (!isOpen) toggle(true);
	}

	function close() {
		if (isOpen) toggle(false);
	}

	const sharedProps = { isOpen, open, close, toggle };

	function handleWindowClick(event) {
		if (!closeOnClickOutside || !isOpen) return;
		const path = event.path || event.composedPath();
		if (path.includes(parent) || path.includes(content)) return;
		close();
	}

	function handleWindowKeyDown(event) {
		if (!isOpen) return;
		onWindowKeyDown(event, sharedProps);
	}

	async function updatePosition() {
		await tick();
		if (!isOpen || !parent || !content) return;
		if (!POSITIONS.includes(position)) position = DEFAULT_POSITION;
		const [mainPosition, secondaryPosition] = position.split('-');

		const {
			top,
			bottom,
			left,
			right,
			width: parentWidth,
			height: parentHeight,
		} = parent.getBoundingClientRect();
		const { height, width } = content.getBoundingClientRect();

		const dimensions = { top, bottom, left, right, height, width };

		const nextMainPosition = getMainPosition(mainPosition, dimensions);
		const nextSecondaryPosition = getSecondaryPosition(
			secondaryPosition,
			dimensions
		);
		const nextPosition = `${nextMainPosition}-${nextSecondaryPosition}`;

		if (currentPosition !== nextPosition) {
			currentPosition = nextPosition;
		}

		topStyle = top;
		leftStyle = left;
		widthStyle = parentWidth;
		heightStyle = parentHeight;
	}
</script>

<svelte:window
	on:mousedown={handleWindowClick}
	on:keydown={handleWindowKeyDown} />

<div class="overlay">
	<div bind:this={parent}>
		<slot name="parent" {toggle} {isOpen} {open} {close} />
	</div>

	<div
		bind:this={contentWrapper}
		class="content-wrapper"
		style={`
    top: ${topStyle}px;
    left: ${leftStyle}px;
    width: ${widthStyle}px;
    height: ${heightStyle}px;
  `}>
		<div class={`content ${currentPosition}`} bind:this={content}>
			{#if isOpen && parent}
				<slot name="content" {toggle} {isOpen} {open} {close} />
			{/if}
		</div>
	</div>

</div>

<style>
  div {
    display: inline-block;
    box-sizing: border-box;
  }

  .overlay {
    position: relative;
  }

  .content-wrapper {
    position: fixed;
    pointer-events: none;
    width: max-content;
  }

  .content-wrapper > * {
    pointer-events: all;
  }

  .content {
    position: absolute;
    min-width: 100%;
  }

  .autoWidth {
    min-width: auto;
  }

  .top-left,
  .top-center,
  .top-right {
    bottom: 100%;
  }

  .bottom-left,
  .bottom-center,
  .bottom-right {
    top: 100%;
  }

  .top-left,
  .bottom-left {
    right: 0;
  }

  .top-center,
  .bottom-center {
    left: 50%;
    transform: translateX(-50%);
  }

  .top-right,
  .bottom-right {
    left: 0;
  }

  .left-top,
  .left-bottom,
  .left-center {
    right: 100%;
  }

  .right-top,
  .right-bottom,
  .right-center {
    left: 100%;
  }

  .left-center,
  .right-center {
    top: 50%;
    transform: translateY(-50%);
  }

  .left-top,
  .right-top {
    bottom: 0;
  }

  .left-bottom,
  .right-bottom {
    top: 0;
  }
</style>
