<script lang="ts">
  import "./layout.css";
  import favicon from "#lib/assets/favicon.svg";
  import {
    Client,
    cacheExchange,
    fetchExchange,
    setContextClient,
  } from "@urql/svelte";
  import type { LayoutProps } from "./$types";
  import { page } from "$app/state";

  setContextClient(
    new Client({
      url: "/graphql",
      exchanges: [cacheExchange, fetchExchange],
      preferGetMethod: false,
    }),
  );

  const links = [
    { href: "/movies", label: "Movies" },
    { href: "/people", label: "People" },
  ];

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header class="border-b bg-white">
  <nav class="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
    <a href="/movies" class="text-lg font-bold">🎬 MovieDB</a>
    <ul class="flex gap-4">
      {#each links as link}
        <li>
          <a
            href={link.href}
            class={page.url.pathname.startsWith(link.href)
              ? "font-semibold text-blue-600"
              : "text-gray-600 hover:text-gray-900"}
            aria-current={page.url.pathname.startsWith(link.href)
              ? "page"
              : undefined}>{link.label}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
</header>

<main class="mx-auto max-w-6xl px-4 py-6">
  {@render children()}
</main>
