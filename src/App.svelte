<script>
	import Overlay, {
		positions as POSITIONS,
	} from './components/components.module';
	import { fly } from 'svelte/transition';

	let isOpen = false;
	let isNestedOpen = false
	let selectedPosition = POSITIONS[0];

	function handleKeyDown(event) {
		if (event.key === 'Escape') {
			if (!isNestedOpen) {
				isOpen = false;
			} else {
				isNestedOpen = false;
			}
		}
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
		closeOnClickOutside
		bind:isOpen={isOpen}
		>
		<button slot="parent" let:toggle on:click={toggle}>Click Me!</button>
		<div transition:fly={{ y: 5, duration: 200 }} slot="content" class="content">
	<Overlay
		position={selectedPosition}
		onWindowKeyDown={handleKeyDown}
		closeOnClickOutside
		bind:isOpen={isNestedOpen}
		>
		<button slot="parent" let:toggle on:click={toggle}>Click Me!</button>
		<div transition:fly={{ y: 5, duration: 200 }} slot="content" class="content">
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. At eligendi vel quidem voluptatum sed, eius illo? Explicabo nam numquam tenetur blanditiis eum quisquam recusandae non consectetur saepe! Nihil commodi amet repudiandae nulla facere temporibus doloribus cupiditate. Aperiam quam consequatur eos magnam quaerat dolorem deserunt ratione similique nobis quasi, impedit hic ipsa officia, aut, praesentium porro. Repellendus beatae nisi earum error nam laboriosam incidunt repudiandae consectetur rem corporis perferendis, tempora quidem qui alias praesentium, hic ad excepturi corrupti quod? Nulla at magnam, harum, esse ullam sunt ipsam, assumenda voluptates accusantium dolor velit officiis cupiditate reprehenderit facere aliquid? Dolor, minima repellat corrupti odio fuga similique quo magnam accusamus officiis porro, ad dolorem quod. Sequi aspernatur suscipit ex nulla necessitatibus molestias inventore quidem iusto esse odit soluta totam atque assumenda, voluptatibus ratione et explicabo expedita obcaecati iure iste maiores impedit cupiditate. Facere a voluptates deserunt animi obcaecati adipisci voluptatem maiores dolores cum natus?
		</div>
	</Overlay>
		</div>
	</Overlay>
</section>

<style>
  section {
    display: flex;
    justify-content: space-around;
    align-items: center;
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
		max-width: 200px;
		max-height: 100px;
		overflow: auto;
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
