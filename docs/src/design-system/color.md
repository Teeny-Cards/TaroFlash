# Color

The Color Palette is an integral part of our design system, meticulously crafted to ensure a consistent and harmonious visual experience across the application. It employs a predefined set of colors available in Tailwind CSS, facilitating a cohesive look and feel that aligns with our branding and design principles.

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

## How to Use

You can effortlessly integrate the color palette into the app through the use of Tailwind CSS.

Use Tailwind's color utility classes to apply text, background, border, and other color styles directly to HTML elements.
Tailwind’s naming convention simplifies the application of colors, e.g., `bg-blue` for backgrounds or `text-red` for text.

The palette is constrained to the colors below and is designed to be accessible and adaptable, ensuring consistency across different components and layouts.

### Color Palette

<div>
  <div class="grid grid-cols-7 gap-2 py-10">
    <div v-for="color in colors" :key="color.label">
        <div class=" w-full h-12 rounded-lg" :style="{ backgroundColor: color.hex }"></div>
        <div class="font-medium text-sm text-grey-dark">{{ color.label }}</div>
        <div class="text-xs text-grey">{{ color.hex }}</div>
      </div>
  </div>
</div>

## Conclusion

Our Tailwind-integrated color palette is designed to streamline your workflow, offering an intuitive and efficient way to apply consistent, brand-aligned colors throughout the application. By leveraging Tailwind's utility classes, you can ensure a cohesive design language that enhances the user experience and maintains visual consistency across the project.
