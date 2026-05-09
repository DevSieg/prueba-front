<template>
  <div class="space-y-8">
    <div class="rounded-[2rem] border border-white/10 bg-surface-50 p-10 shadow-soft">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl space-y-4">
          <p class="uppercase tracking-[0.35em] text-sm text-brand-300">Panel de administración</p>
          <h1 class="text-4xl font-display font-bold text-white sm:text-5xl">Bienvenido al dashboard</h1>
          <p class="max-w-xl text-sm leading-7 text-white/60">
            Gestiona categorías y productos desde una interfaz limpia diseñada con Tailwind CSS.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <router-link
            to="/categorias"
            class="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-center transition hover:bg-white/10"
          >
            <p class="text-sm text-white/60">Categorías</p>
            <p class="mt-3 text-2xl font-bold text-brand-400">Ir</p>
          </router-link>
          <router-link
            to="/productos"
            class="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-center transition hover:bg-white/10"
          >
            <p class="text-sm text-white/60">Productos</p>
            <p class="mt-3 text-2xl font-bold text-brand-400">Ir</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
