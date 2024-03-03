# Color Pallete

These are the colors that are used in the design system. They are used to create a consistent look and feel across the application.

<script setup>
  import tailwindConfig from '@app/tailwind.config.js'

  const colors = Object.entries(tailwindConfig.theme.colors).flatMap(([colorKey, colorValue]) => {
    if (typeof colorValue === 'object') {
      return Object.entries(colorValue).map(([shadeKey, hexValue]) => {
        const label = shadeKey === 'DEFAULT' ? colorKey : `${colorKey}-${shadeKey}`;
        return { label, hex: hexValue };
      });
    } else {
      return [{ label: colorKey, hex: colorValue }];
    }
  })
</script>

<div>
  <div class="grid grid-cols-7 gap-2 py-14">
    <div v-for="color in colors" :key="color.label">
        <div class=" w-full h-12 rounded-lg" :style="{ backgroundColor: color.hex }"></div>
        <div class="font-medium text-sm text-grey-dark">{{ color.label }}</div>
        <div class="text-xs text-grey">{{ color.hex }}</div>
      </div>
  </div>
</div>
