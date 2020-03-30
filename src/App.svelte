<script>
	import Overlay, {
		positions as POSITIONS,
	} from './components/components.module.js';
	import { fly } from 'svelte/transition';

	let isOpen = false;
	let selectedPosition = POSITIONS[0];

	let mouseOnContent = false;

	function handleKeyDown(event, { close }) {
		if (event.key === 'Escape') close();
	}

	function handleToggle(event) {
		if (event.detail !== isOpen) isOpen = event.detail;
	}
</script>

<svelte:head>
	<title>Svelte Overlay component</title>
	<style>
		body {
			margin: 0;
		}
	</style>
</svelte:head>

<select
	bind:value={selectedPosition}
	on:change={({ target }) => (selectedPosition = target.value || '')}>
	{#each POSITIONS as value}
		<option {value}>{value}</option>
	{/each}
</select>

<section>
	<Overlay
		position={selectedPosition}
		onWindowKeyDown={handleKeyDown}
		on:toggle={handleToggle}
		updateOnScroll
		{isOpen}>
		<button slot="parent" let:toggle on:click={toggle}>Click Me!</button>
		<div transition:fly={{ y: 5, duration: 200 }} slot="content" class="content" let:close>
			Lorem ipsum dolor sit.
		</div>
	</Overlay>
</section>

<style>
  section {
    display: flex;
    /* justify-content: space-around; */
    /* align-items: center; */
		margin-top: 20em;
		margin-left: 20em;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  }
  .content {
    border: 1px solid #ddd;
    background: #f7f7f7;
    text-align: center;
    padding: 1em;
    width: max-content;
		font-family: sans-serif;
		font-size: 14px;
  }
	button {
		font-family: sans-serif;
	}

  select {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
