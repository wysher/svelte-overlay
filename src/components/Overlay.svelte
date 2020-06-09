<script>
	import {
		beforeUpdate,
		onMount,
		onDestroy,
		tick,
		createEventDispatcher,
	} from 'svelte';
	import POSITIONS from './positions';
	import { isBrowser, getNextPosition } from './helpers';
	const dispatch = createEventDispatcher();

	const DEFAULT_POSITION = POSITIONS[0];

	export let isOpen = false;
	export let updateOnScroll = false;
	export let closeOnScroll = false;
	export let position = DEFAULT_POSITION;
	export let closeOnClickOutside = false;
	export let zIndex = 1;
	export let onWindowKeyDown = () => {};
	export let style = '';
	let className = '';
	export { className as class };

	let currentPosition = null;
	let parent;
	let content;
	let target;

	let topStyle = 0;
	let leftStyle = 0;
	let widthStyle = 0;
	let heightStyle = 0;

	$: hasParent = !parent || !!parent.childNodes.length;
	$: hasContent = !content || !!content.childNodes.length;

	$: if(!hasParent) throw new Error('parent slot is required');
	$: if(!hasContent) throw new Error('content slot is required');

	$: openedState = isOpen && hasParent && hasContent;

	function addListeners() {
		if (!isBrowser()) return;
		window.addEventListener('resize', updatePosition);
		if (closeOnScroll) window.addEventListener('scroll', close);
		else if (updateOnScroll) window.addEventListener('scroll', updatePosition);
	}

	function removeListeners() {
		if (!isBrowser()) return;
		window.removeEventListener('resize', updatePosition);
		window.removeEventListener('scroll', updatePosition);
		window.removeEventListener('scroll', close);
	}

	onMount(() => {
		if (openedState) {
			addListeners();
		}
	});

	onDestroy(() => {
		if (!isBrowser()) return;
		removeListeners();
	});


	beforeUpdate(updatePosition);

	function toggle(value) {
		const prevOpen = isOpen;
		const nextOpen = value === true || value === false ? value : !isOpen;

		if (nextOpen && hasParent && hasContent || !nextOpen) isOpen = nextOpen;

		if(prevOpen !== isOpen) {
			dispatch('toggle', isOpen);
			if (isOpen) {
				addListeners();
				dispatch('open');
			} else {
				dispatch('close');
				removeListeners();
			}
		}

	}

	function open() {
		if (!openedState) toggle(true);
	}

	function close() {
		if (openedState) toggle(false);
	}

	function contains (event) {
		const path = event.path || event.composedPath();
		return path.includes(parent) || path.includes(content);
	}

	function handleWindowClick(event) {
		if (!closeOnClickOutside || !openedState || contains(event)) return;
		close();
	}

	function handleWindowKeyDown(event) {
		if (!onWindowKeyDown || !openedState) return;
		onWindowKeyDown(event, { isOpen: openedState, open, close, toggle, contains });
	}

	async function updatePosition() {
		await tick();
		if (!openedState) return;
		if (!POSITIONS.includes(position)) position = DEFAULT_POSITION;

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
		const nextPosition = getNextPosition(position, dimensions);

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

<div bind:this={target} class={`overlay ${className}`} style={`z-index:${zIndex}; ${style}`}>
	<div bind:this={parent}>
		<slot name="parent" {toggle} isOpen={openedState} {open} {close} />
	</div>
	<div
		class="content-wrapper"
		style={`top: ${topStyle}px; left: ${leftStyle}px; width: ${widthStyle}px; height: ${heightStyle}px; z-index:${zIndex};`}
	>
		{#if openedState}
			<div class={`content ${currentPosition || ''}`} bind:this={content}>
					<slot name="content" {toggle} isOpen={openedState} {open} {close} />
			</div>
		{/if}
	</div>
</div>

<style>
  .overlay {
    position: relative;
		display: inline-block;
		box-sizing: border-box;
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
